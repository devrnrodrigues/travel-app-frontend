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
  errors,
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

          <View
            style={[
              styles.inputWithCounterContainer,
              !isDarkMode && styles.inputWithCounterContainerLight,
              isInputFocused &&
                (isDarkMode
                  ? styles.editDialogInputFocused
                  : styles.editDialogInputFocusedLight),
              errors?.caption && styles.editDialogInputError,
            ]}
          >
            <TextInput
              ref={inputRef}
              value={captionText}
              onChangeText={onChangeCaptionText}
              placeholder="Ex: Férias em Paris"
              placeholderTextColor="#8E8E93"
              onFocus={onFocusInput}
              onBlur={onBlurInput}
              style={[
                styles.inputWithCounterField,
                !isDarkMode && styles.inputWithCounterFieldLight,
              ]}
              maxLength={30}
              returnKeyType="done"
              onSubmitEditing={onSave}
            />
            <Text
              style={[
                styles.inlineCharCountText,
                !isDarkMode && styles.inlineCharCountTextLight,
              ]}
            >
              {captionText.length}/30
            </Text>
          </View>

          {errors?.caption && (
            <Text style={styles.modalFieldErrorText}>{errors.caption}</Text>
          )}

          {errors?.submit && (
            <Text style={styles.modalFieldErrorText}>{errors.submit}</Text>
          )}

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
