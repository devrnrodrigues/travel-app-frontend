import { useState, useCallback } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { createCollectionApi } from "../api/collectionService";

export default function useCreateCollection(queryClient) {
  const [addCollectionModalVisible, setAddCollectionModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollectionPhotos, setSelectedCollectionPhotos] = useState([]);
  const [isPickingPhotos, setIsPickingPhotos] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  const handlePickCollectionPhotos = useCallback(async () => {
    if (isPickingPhotos || isCreatingCollection) return;
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir o acesso à galeria para selecionar fotos da coleção."
        );
        return;
      }

      setIsPickingPhotos(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const compressedUris = [];
      for (let i = 0; i < result.assets.length; i++) {
        const a = result.assets[i];
        let finalUri = a.uri;
        try {
          const manipulated = await manipulateAsync(
            a.uri,
            [],
            { format: SaveFormat.WEBP, compress: 0.85 }
          );
          finalUri = manipulated.uri;
        } catch {
          finalUri = a.uri;
        }
        compressedUris.push(finalUri);
      }

      setSelectedCollectionPhotos((prev) => [...prev, ...compressedUris]);
    } catch {
      Alert.alert("Erro", "Não foi possível selecionar as fotos.");
    } finally {
      setIsPickingPhotos(false);
    }
  }, [isPickingPhotos, isCreatingCollection]);

  const handleRemoveCollectionPhoto = useCallback((indexToRemove) => {
    setSelectedCollectionPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }, []);

  const handleSaveCollection = useCallback(async () => {
    const trimmedTitle = newCollectionName.trim();
    if (!trimmedTitle) {
      Alert.alert("Atenção", "Por favor, informe um nome para a coleção.");
      return;
    }
    if (trimmedTitle.length > 30) {
      Alert.alert("Atenção", "O nome da coleção deve ter no máximo 30 caracteres.");
      return;
    }
    if (!selectedCollectionPhotos || selectedCollectionPhotos.length === 0) {
      Alert.alert("Atenção", "Por favor, selecione ao menos uma foto.");
      return;
    }

    setIsCreatingCollection(true);
    try {
      await createCollectionApi({
        title: trimmedTitle,
        imageUris: selectedCollectionPhotos,
      });

      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setNewCollectionName("");
      setSelectedCollectionPhotos([]);
      setAddCollectionModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível criar a coleção.");
    } finally {
      setIsCreatingCollection(false);
    }
  }, [newCollectionName, selectedCollectionPhotos, queryClient]);

  return {
    addCollectionModalVisible,
    setAddCollectionModalVisible,
    newCollectionName,
    setNewCollectionName,
    selectedCollectionPhotos,
    setSelectedCollectionPhotos,
    isPickingPhotos,
    isCreatingCollection,
    handlePickCollectionPhotos,
    handleRemoveCollectionPhoto,
    handleSaveCollection,
  };
}
