import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import {
  updatePhotoCaptionApi,
  updateCollectionApi,
  deleteCollectionApi,
  addPhotosToCollectionApi,
  deletePhotoApi,
  setCoverPhotoApi,
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
  const [captionErrors, setCaptionErrors] = useState({});

  const [isEditCollectionModalOpen, setIsEditCollectionModalOpen] = useState(false);
  const [editCollectionTitle, setEditCollectionTitle] = useState(initialCollection?.title || "");
  const [selectedPhotoIdsToDelete, setSelectedPhotoIdsToDelete] = useState([]);
  const [isSavingEditCollection, setIsSavingEditCollection] = useState(false);
  const [editCollectionErrors, setEditCollectionErrors] = useState({});

  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);
  const [newPhotosToUpload, setNewPhotosToUpload] = useState([]);
  const [isPickingPhotos, setIsPickingPhotos] = useState(false);
  const [isSavingNewPhotos, setIsSavingNewPhotos] = useState(false);
  const [addPhotosErrors, setAddPhotosErrors] = useState({});

  const [isDeleteCollectionModalOpen, setIsDeleteCollectionModalOpen] = useState(false);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);

  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);

  const handleOpenEditCaption = useCallback((photo) => {
    setEditingPhoto(photo);
    setCaptionText(photo.caption || "");
    setCaptionErrors({});
    setIsEditingCaption(true);
  }, []);

  const handleSaveCaption = useCallback(async () => {
    if (!editingPhoto || !collection?.id) return;
    const trimmedCaption = captionText ? captionText.trim() : "";
    if (trimmedCaption.length > 30) {
      setCaptionErrors({ caption: "A legenda deve ter no máximo 30 caracteres" });
      return;
    }
    setCaptionErrors({});
    setIsSavingCaption(true);
    try {
      const updated = await updatePhotoCaptionApi(collection.id, editingPhoto.id, trimmedCaption);
      setCollection((prev) => ({
        ...prev,
        photos: (prev.photos || []).map((p) =>
          p.id === editingPhoto.id ? { ...p, caption: trimmedCaption } : p
        ),
      }));
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setIsEditingCaption(false);
      setEditingPhoto(null);
      setCaptionErrors({});
    } catch {
      setCaptionErrors({ submit: "Não foi possível salvar a legenda." });
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
    const errors = {};
    const trimmed = editCollectionTitle.trim();
    if (!trimmed) {
      errors.title = "Preencha o nome da coleção";
    } else if (trimmed.length > 30) {
      errors.title = "O nome deve ter no máximo 30 caracteres";
    }

    if (!collection?.id) return;

    if (Object.keys(errors).length > 0) {
      setEditCollectionErrors(errors);
      return;
    }

    setEditCollectionErrors({});
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
      setEditCollectionErrors({});
    } catch {
      setEditCollectionErrors({ submit: "Não foi possível atualizar a coleção." });
    } finally {
      setIsSavingEditCollection(false);
    }
  }, [editCollectionTitle, collection?.id, selectedPhotoIdsToDelete, queryClient]);

  const handlePickNewPhotos = useCallback(async () => {
    if (isPickingPhotos || isSavingNewPhotos) return;
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setAddPhotosErrors({ photos: "Permita o acesso à galeria para selecionar fotos." });
        return;
      }
      setIsPickingPhotos(true);
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets) {
        setNewPhotosToUpload((prev) => [
          ...prev,
          ...res.assets.map((a) => a.uri),
        ]);
        setAddPhotosErrors((prev) => ({ ...prev, photos: null }));
      }
    } catch {
      setAddPhotosErrors({ photos: "Não foi possível selecionar fotos." });
    } finally {
      setIsPickingPhotos(false);
    }
  }, [isPickingPhotos, isSavingNewPhotos]);

  const handleRemoveNewPhoto = useCallback((idx) => {
    setNewPhotosToUpload((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSaveNewPhotos = useCallback(async () => {
    if (!collection?.id) return;
    if (!newPhotosToUpload || newPhotosToUpload.length === 0) {
      setAddPhotosErrors({ photos: "Selecione no mínimo 1 foto para adicionar" });
      return;
    }
    setAddPhotosErrors({});
    setIsSavingNewPhotos(true);
    try {
      const updated = await addPhotosToCollectionApi(collection.id, newPhotosToUpload);
      if (updated?.photos) {
        setCollection(updated);
      }
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setNewPhotosToUpload([]);
      setAddPhotosErrors({});
      setIsAddPhotosModalOpen(false);
    } catch (err) {
      console.error(err);
      const detail =
        err?.message ||
        (err?.data && typeof err.data === "object" && (err.data.message || err.data.error)) ||
        "Não foi possível adicionar fotos.";
      setAddPhotosErrors({ submit: String(detail) });
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingPhoto(false);
    }
  }, [photoToDelete, collection?.id, queryClient, selectedPhotoIndex]);

  const handleSetCoverPhoto = useCallback(async (photo) => {
    if (!photo?.id || !collection?.id) return;
    try {
      setCollection((prev) => {
        const currentPhotos = prev?.photos || [];
        const targetPhoto = currentPhotos.find((p) => p.id === photo.id);
        if (!targetPhoto) return prev;
        const reordered = [
          targetPhoto,
          ...currentPhotos.filter((p) => p.id !== photo.id),
        ];
        return { ...prev, photos: reordered };
      });

      await setCoverPhotoApi(collection.id, photo.id);
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
    } catch {
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
    }
  }, [collection?.id, queryClient]);

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
    captionErrors,
    setCaptionErrors,
    handleOpenEditCaption,
    handleSaveCaption,
    isEditCollectionModalOpen,
    setIsEditCollectionModalOpen,
    editCollectionTitle,
    setEditCollectionTitle,
    selectedPhotoIdsToDelete,
    setSelectedPhotoIdsToDelete,
    isSavingEditCollection,
    editCollectionErrors,
    setEditCollectionErrors,
    handleTogglePhotoDelete,
    handleSaveEditCollection,
    isAddPhotosModalOpen,
    setIsAddPhotosModalOpen,
    newPhotosToUpload,
    setNewPhotosToUpload,
    isPickingPhotos,
    isSavingNewPhotos,
    addPhotosErrors,
    setAddPhotosErrors,
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
    handleSetCoverPhoto,
  };
}
