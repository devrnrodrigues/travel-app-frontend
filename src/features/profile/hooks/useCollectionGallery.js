import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
  updatePhotoCaptionApi,
  updateCollectionApi,
  deleteCollectionApi,
  addPhotosToCollectionApi,
  deletePhotoApi,
} from "../api/collectionService";

export default function useCollectionGallery(initialCollection, navigation) {
  const queryClient = useQueryClient();
  const [collection, setCollection] = useState(initialCollection);

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [captionText, setCaptionText] = useState("");
  const [isSavingCaption, setIsSavingCaption] = useState(false);

  const [isEditCollectionModalOpen, setIsEditCollectionModalOpen] = useState(false);
  const [editCollectionTitle, setEditCollectionTitle] = useState(initialCollection?.title || "");
  const [selectedPhotoIdsToDelete, setSelectedPhotoIdsToDelete] = useState([]);
  const [isSavingEditCollection, setIsSavingEditCollection] = useState(false);

  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);
  const [newPhotosToUpload, setNewPhotosToUpload] = useState([]);
  const [isPickingPhotos, setIsPickingPhotos] = useState(false);
  const [isSavingNewPhotos, setIsSavingNewPhotos] = useState(false);

  const [isDeleteCollectionModalOpen, setIsDeleteCollectionModalOpen] = useState(false);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);

  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);

  const handleOpenEditCaption = useCallback((photo) => {
    setEditingPhoto(photo);
    setCaptionText(photo.caption || "");
    setIsEditingCaption(true);
  }, []);

  const handleSaveCaption = useCallback(async () => {
    if (!editingPhoto || !collection?.id) return;
    setIsSavingCaption(true);
    try {
      const updated = await updatePhotoCaptionApi(collection.id, editingPhoto.id, captionText.trim());
      setCollection((prev) => ({
        ...prev,
        photos: (prev.photos || []).map((p) =>
          p.id === editingPhoto.id ? { ...p, caption: captionText.trim() } : p
        ),
      }));
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setIsEditingCaption(false);
      setEditingPhoto(null);
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a legenda.");
    } finally {
      setIsSavingCaption(false);
    }
  }, [editingPhoto, collection?.id, captionText, queryClient]);

  const handleTogglePhotoDelete = useCallback((photoId) => {
    setSelectedPhotoIdsToDelete((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  }, []);

  const handleSaveEditCollection = useCallback(async () => {
    const trimmed = editCollectionTitle.trim();
    if (!trimmed) {
      Alert.alert("Atenção", "O título não pode ficar vazio.");
      return;
    }
    if (!collection?.id) return;

    setIsSavingEditCollection(true);
    try {
      const updated = await updateCollectionApi(collection.id, {
        title: trimmed,
        deletePhotoIds: selectedPhotoIdsToDelete,
      });
      setCollection((prev) => ({
        ...prev,
        title: trimmed,
        photos: (prev.photos || []).filter((p) => !selectedPhotoIdsToDelete.includes(p.id)),
      }));
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setIsEditCollectionModalOpen(false);
      setSelectedPhotoIdsToDelete([]);
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar a coleção.");
    } finally {
      setIsSavingEditCollection(false);
    }
  }, [editCollectionTitle, collection?.id, selectedPhotoIdsToDelete, queryClient]);

  const handlePickNewPhotos = useCallback(async () => {
    if (isPickingPhotos || isSavingNewPhotos) return;
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permissão necessária", "Permita o acesso à galeria.");
        return;
      }
      setIsPickingPhotos(true);
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets) {
        const compressed = [];
        for (const a of res.assets) {
          try {
            const m = await manipulateAsync(a.uri, [], { format: SaveFormat.WEBP, compress: 0.85 });
            compressed.push(m.uri);
          } catch {
            compressed.push(a.uri);
          }
        }
        setNewPhotosToUpload((prev) => [...prev, ...compressed]);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível selecionar fotos.");
    } finally {
      setIsPickingPhotos(false);
    }
  }, [isPickingPhotos, isSavingNewPhotos]);

  const handleRemoveNewPhoto = useCallback((idx) => {
    setNewPhotosToUpload((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSaveNewPhotos = useCallback(async () => {
    if (newPhotosToUpload.length === 0 || !collection?.id) return;
    setIsSavingNewPhotos(true);
    try {
      const updated = await addPhotosToCollectionApi(collection.id, newPhotosToUpload);
      if (updated?.photos) {
        setCollection(updated);
      }
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setNewPhotosToUpload([]);
      setIsAddPhotosModalOpen(false);
    } catch {
      Alert.alert("Erro", "Não foi possível adicionar fotos.");
    } finally {
      setIsSavingNewPhotos(false);
    }
  }, [newPhotosToUpload, collection?.id, queryClient]);

  const handleDeleteCollection = useCallback(async () => {
    if (!collection?.id) return;
    setIsDeletingCollection(true);
    try {
      await deleteCollectionApi(collection.id);
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setIsDeleteCollectionModalOpen(false);
      navigation.goBack();
    } catch {
      Alert.alert("Erro", "Não foi possível excluir a coleção.");
    } finally {
      setIsDeletingCollection(false);
    }
  }, [collection?.id, queryClient, navigation]);

  const handleConfirmDeletePhoto = useCallback((photo) => {
    setPhotoToDelete(photo);
    setIsDeletePhotoModalOpen(true);
  }, []);

  const handleDeletePhoto = useCallback(async () => {
    if (!photoToDelete || !collection?.id) return;
    setIsDeletingPhoto(true);
    try {
      await deletePhotoApi(collection.id, photoToDelete.id);
      setCollection((prev) => ({
        ...prev,
        photos: (prev.photos || []).filter((p) => p.id !== photoToDelete.id),
      }));
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setIsDeletePhotoModalOpen(false);
      setPhotoToDelete(null);
      if (selectedPhotoIndex !== null) {
        setSelectedPhotoIndex(null);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível excluir a foto.");
    } finally {
      setIsDeletingPhoto(false);
    }
  }, [photoToDelete, collection?.id, queryClient, selectedPhotoIndex]);

  return {
    collection,
    selectedPhotoIndex,
    setSelectedPhotoIndex,
    isMenuOpen,
    setIsMenuOpen,
    isEditingCaption,
    setIsEditingCaption,
    captionText,
    setCaptionText,
    isSavingCaption,
    handleOpenEditCaption,
    handleSaveCaption,
    isEditCollectionModalOpen,
    setIsEditCollectionModalOpen,
    editCollectionTitle,
    setEditCollectionTitle,
    selectedPhotoIdsToDelete,
    isSavingEditCollection,
    handleTogglePhotoDelete,
    handleSaveEditCollection,
    isAddPhotosModalOpen,
    setIsAddPhotosModalOpen,
    newPhotosToUpload,
    isPickingPhotos,
    isSavingNewPhotos,
    handlePickNewPhotos,
    handleRemoveNewPhoto,
    handleSaveNewPhotos,
    isDeleteCollectionModalOpen,
    setIsDeleteCollectionModalOpen,
    isDeletingCollection,
    handleDeleteCollection,
    isDeletePhotoModalOpen,
    setIsDeletePhotoModalOpen,
    photoToDelete,
    isDeletingPhoto,
    handleConfirmDeletePhoto,
    handleDeletePhoto,
  };
}
