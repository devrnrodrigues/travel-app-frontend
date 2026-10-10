import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleProp, ViewStyle, TextInputProps } from "react-native";
import { HomeTheme } from "../../home/types/home.types";

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  nationality?: string | null;
  commentsCount?: number;
  createdAt?: string;
  provider?: string;
  role?: string;
}

export interface CollectionPhoto {
  id: string;
  url: string;
  caption?: string | null;
  orderIndex?: number;
  createdAt?: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  photos: CollectionPhoto[];
  coverUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export interface CollectionGalleryScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      collection: CollectionItem;
    };
  };
}

export interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  setName: (name: string) => void;
  nationality: string;
  setNationality: (nationality: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  currentTheme: HomeTheme;
  isDarkMode: boolean;
  galleryCount?: number | string;
  onGalleryCountChange?: (count: number | string) => void;
  aestheticMode?: "minimalista" | "decorativa";
  onAestheticModeChange?: (mode: "minimalista" | "decorativa") => void;
}

export interface LogoutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoggingOut: boolean;
  isDarkMode: boolean;
  currentTheme: HomeTheme;
}

export interface AvatarViewerModalProps {
  visible: boolean;
  avatarUrl?: string | null;
  onClose: () => void;
  onChangePhoto: () => Promise<void>;
  isUploading: boolean;
  currentTheme: HomeTheme;
  isDarkMode: boolean;
}

export interface AddCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  collectionName: string;
  setCollectionName: (name: string) => void;
  selectedPhotos: string[];
  onPickPhotos: () => Promise<void>;
  onRemovePhoto: (index: number) => void;
  onSave: () => Promise<void>;
  isCreating: boolean;
  isPicking: boolean;
  currentTheme: HomeTheme;
  isDarkMode: boolean;
}

export interface GalleryMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPhotos: () => void;
  onEditCollection: () => void;
  onDeleteCollection: () => void;
  isDarkMode: boolean;
  currentTheme: HomeTheme;
}

export interface PhotoViewerModalProps {
  visible: boolean;
  photos: CollectionPhoto[];
  initialIndex: number;
  onClose: () => void;
  onEditCaption: (photo: CollectionPhoto) => void;
  onDeletePhoto: (photo: CollectionPhoto) => void;
  isDarkMode: boolean;
  currentTheme: HomeTheme;
}

export interface EditCaptionModalProps {
  visible: boolean;
  caption: string;
  setCaption: (caption: string) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
  isDarkMode: boolean;
  currentTheme: HomeTheme;
}

export interface EditCollectionModalProps {
  visible: boolean;
  collectionTitle: string;
  setCollectionTitle: (title: string) => void;
  photos: CollectionPhoto[];
  selectedPhotoIdsToDelete: string[];
  onTogglePhotoDelete: (photoId: string) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
  isDarkMode: boolean;
  currentTheme: HomeTheme;
}

export interface AddPhotosModalProps {
  visible: boolean;
  newPhotoUris: string[];
  onPickPhotos: () => Promise<void>;
  onRemoveNewPhoto: (index: number) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
  isPicking: boolean;
  isDarkMode: boolean;
  currentTheme: HomeTheme;
}

export interface DeleteConfirmModalProps {
  visible: boolean;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isDeleting: boolean;
  isDarkMode: boolean;
  currentTheme: HomeTheme;
}

export interface PolaroidStackCardProps {
  item: CollectionItem;
  isDarkMode: boolean;
  currentTheme: HomeTheme;
}

export interface AnimatedProfileInputProps extends TextInputProps {
  isFocused: boolean;
  style?: StyleProp<ViewStyle>;
  currentTheme: HomeTheme;
  isDarkMode: boolean;
}

export interface CountryPillSkeletonProps {
  isDarkMode: boolean;
  width?: number;
}
