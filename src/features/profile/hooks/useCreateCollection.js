import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { createCollectionApi } from "../api/collectionService";

export default function useCreateCollection(queryClient) {
  const [addCollectionModalVisible, setAddCollectionModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCollectionNameFocused, setIsCollectionNameFocused] = useState(false);
  const [selectedCollectionPhotos, setSelectedCollectionPhotos] = useState([]);
  const [isPickingPhotos, setIsPickingPhotos] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handlePickCollectionPhotos = useCallback(async () => {
    if (isPickingPhotos || isCreatingCollection) return;
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        setFormErrors((prev) => ({
          ...prev,
          photos: "Permita o acesso à galeria para selecionar fotos.",
        }));
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

      const newUris = result.assets.map((a) => a.uri);
      setSelectedCollectionPhotos((prev) => {
        const combined = [...prev, ...newUris];
        if (combined.length > 10) {
          setFormErrors((e) => ({
            ...e,
            photos: "Limite de 10 fotos por envio atingido (as primeiras 10 foram mantidas).",
          }));
          return combined.slice(0, 10);
        }
        setFormErrors((e) => ({ ...e, photos: null }));
        return combined;
      });
    } catch {
      setFormErrors((prev) => ({
        ...prev,
        photos: "Não foi possível selecionar as fotos.",
      }));
    } finally {
      setIsPickingPhotos(false);
    }
  }, [isPickingPhotos, isCreatingCollection]);

  const handleRemoveCollectionPhoto = useCallback((indexToRemove) => {
    setSelectedCollectionPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }, []);

  const handleSaveCollection = useCallback(async () => {
    const errors = {};
    const trimmedTitle = newCollectionName.trim();
    if (!trimmedTitle) {
      errors.title = "Preencha o nome da coleção";
    } else if (trimmedTitle.length > 30) {
      errors.title = "O nome deve ter no máximo 30 caracteres";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsCreatingCollection(true);
    try {
      await createCollectionApi({
        title: trimmedTitle,
        imageUris: selectedCollectionPhotos,
      });

      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setNewCollectionName("");
      setSelectedCollectionPhotos([]);
      setFormErrors({});
      setAddCollectionModalVisible(false);
    } catch (err) {
      console.error(err);
      const detail =
        err?.message ||
        (err?.data && typeof err.data === "object" && (err.data.message || err.data.error)) ||
        "Não foi possível criar a coleção.";
      setFormErrors({ submit: String(detail) });
    } finally {
      setIsCreatingCollection(false);
    }
  }, [newCollectionName, selectedCollectionPhotos, queryClient]);

  const handleCloseModal = useCallback(() => {
    if (!isCreatingCollection && !isPickingPhotos) {
      setFormErrors({});
      setAddCollectionModalVisible(false);
    }
  }, [isCreatingCollection, isPickingPhotos]);

  return {
    addCollectionModalVisible,
    setAddCollectionModalVisible,
    newCollectionName,
    setNewCollectionName,
    isCollectionNameFocused,
    setIsCollectionNameFocused,
    selectedCollectionPhotos,
    setSelectedCollectionPhotos,
    isPickingPhotos,
    isCreatingCollection,
    formErrors,
    setFormErrors,
    handlePickCollectionPhotos,
    handleRemoveCollectionPhoto,
    handleSaveCollection,
    handleCloseModal,
  };
}
