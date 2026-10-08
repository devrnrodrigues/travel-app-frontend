import React, { memo } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  styles,
  getEditDialogAnimatedStyle,
} from "../styles/collectionGallery.styles";

const EditCaptionModal = memo(function EditCaptionModal({
  visible,
  captionText,
  onChangeCaptionText,
  isInputFocused,
  onFocusInput,
  onBlurInput,
  isSavingCaption,
  modalTranslateY,
  modalScale,
  onClose,
  onSave,
  isDarkMode,
  inputRef,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.editDialogOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.editDialogBox,
            !isDarkMode && styles.editDialogBoxLight,
            getEditDialogAnimatedStyle(modalTranslateY, modalScale),
          ]}
        >
          <Text
            style={[
              styles.editDialogTitle,
              !isDarkMode && styles.editDialogTitleLight,
            ]}
          >
            Titulo
          </Text>
          <Text
            style={[
              styles.editDialogSubtitle,
              !isDarkMode && styles.editDialogSubtitleLight,
            ]}
          >
            Esse nome aparecerá escrito na foto do polaroid
          </Text>

          <TextInput
            ref={inputRef}
            value={captionText}
            onChangeText={onChangeCaptionText}
            placeholder="Ex: Férias em Paris"
            placeholderTextColor="#8E8E93"
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            style={[
              styles.editDialogInput,
              !isDarkMode && styles.editDialogInputLight,
              isInputFocused &&
                (isDarkMode
                  ? styles.editDialogInputFocused
                  : styles.editDialogInputFocusedLight),
            ]}
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={onSave}
          />

          <View style={styles.charCountRow}>
            <Text
              style={[
                styles.charCountText,
                !isDarkMode && styles.charCountTextLight,
              ]}
            >
              {captionText.length}/30
            </Text>
          </View>

          <View style={styles.editDialogButtons}>
            <TouchableOpacity
              style={styles.editDialogCancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
              disabled={isSavingCaption}
            >
              <Text style={styles.editDialogCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.editDialogSaveBtn,
                !isDarkMode && styles.editDialogSaveBtnLight,
              ]}
              onPress={onSave}
              activeOpacity={0.8}
              disabled={isSavingCaption}
            >
              {isSavingCaption ? (
                <ActivityIndicator
                  size="small"
                  color={isDarkMode ? "#000000" : "#FFFFFF"}
                />
              ) : (
                <Text
                  style={[
                    styles.editDialogSaveText,
                    !isDarkMode && styles.editDialogSaveTextLight,
                  ]}
                >
                  Salvar
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

export default EditCaptionModal;
