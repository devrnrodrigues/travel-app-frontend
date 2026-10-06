import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";

export function useCommentPhotoViewer({
  visible,
  photos = [],
  initialIndex = 0,
  onClose,
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setActiveIndex(initialIndex);
      setTimeout(() => {
        if (flatListRef.current && photos.length > 0 && initialIndex < photos.length) {
          flatListRef.current.scrollToIndex({
            index: initialIndex,
            animated: false,
          });
        }
      }, 50);
    }
  }, [visible, initialIndex, photos.length]);

  useEffect(() => {
    if (Platform.OS !== "web" || !visible) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, photos.length, onClose]);

  const handleNextWeb = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevWeb = () => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleMomentumScrollEnd = (e, screenWidth) => {
    const nextIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    if (nextIndex >= 0 && nextIndex < photos.length) {
      setActiveIndex(nextIndex);
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    flatListRef,
    handleNextWeb,
    handlePrevWeb,
    handleMomentumScrollEnd,
  };
}

export default useCommentPhotoViewer;
