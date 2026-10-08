import { useState, useCallback } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { uploadAvatarApi } from "../api/profileService";
import { useAuth } from "../../../context/AuthContext";

export default function useProfileAvatar() {
  const { updateUser } = useAuth();
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handlePickAndUploadAvatar = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir o acesso à galeria para alterar a foto de perfil."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const selectedUri = result.assets[0].uri;
      setIsUploadingAvatar(true);

      const manipulated = await manipulateAsync(
        selectedUri,
        [],
        { format: SaveFormat.WEBP }
      );

      const updatedUser = await uploadAvatarApi(manipulated.uri);
      if (updatedUser?.avatarUrl) {
        await updateUser({ avatarUrl: updatedUser.avatarUrl });
      }
    } catch (err) {
      console.error(err);
      const detail =
        (err?.data && typeof err.data === "object" && (err.data.message || err.data.error)) ||
        err?.message ||
        "Não foi possível enviar a imagem.";
      Alert.alert("Erro ao enviar", String(detail));
    } finally {
      setIsUploadingAvatar(false);
    }
  }, [updateUser]);

  return {
    avatarModalVisible,
    setAvatarModalVisible,
    isUploadingAvatar,
    handlePickAndUploadAvatar,
  };
}
