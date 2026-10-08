import { useRef, useState, useCallback, useEffect } from "react";
import { Dimensions } from "react-native";

export default function useHomeCategories(activeCat, setActiveCat, windowWidth) {
  const categoryScrollRef = useRef(null);
  const itemLayouts = useRef({});
  const scrollWidthRef = useRef(Dimensions.get("window").width);
  const contentWidthRef = useRef(0);
  const [scrollWidth, setScrollWidth] = useState(Dimensions.get("window").width);
  const [contentWidth, setContentWidth] = useState(0);

  const centerCategory = useCallback((index, animated = true) => {
    if (index === undefined || index === null) return;
    const layout = itemLayouts.current[index];
    const sWidth = scrollWidthRef.current || Dimensions.get("window").width;
    const cWidth = contentWidthRef.current;
    if (layout && categoryScrollRef.current && sWidth > 0) {
      const targetX = layout.x - (sWidth / 2) + (layout.width / 2);
      const maxScroll = cWidth > 0 ? Math.max(0, cWidth - sWidth) : Math.max(0, targetX);
      const clampedX = Math.max(0, Math.min(targetX, maxScroll));
      categoryScrollRef.current.scrollTo({ x: clampedX, animated });
    }
  }, []);

  const handleCategoryPress = useCallback((index) => {
    setActiveCat(index);
    centerCategory(index, true);
  }, [setActiveCat, centerCategory]);

  const handleCategoryLayout = useCallback((index, layout) => {
    itemLayouts.current[index] = layout;
    if (index === activeCat) {
      centerCategory(index, true);
    }
  }, [activeCat, centerCategory]);

  const handleContainerLayout = useCallback((e) => {
    const width = e.nativeEvent.layout.width;
    scrollWidthRef.current = width;
    setScrollWidth(width);
  }, []);

  const handleContentSizeChange = useCallback((w) => {
    contentWidthRef.current = w;
    setContentWidth(w);
    if (activeCat !== undefined && activeCat !== null) {
      centerCategory(activeCat, false);
    }
  }, [activeCat, centerCategory]);

  useEffect(() => {
    centerCategory(activeCat, true);
  }, [activeCat, centerCategory]);

  useEffect(() => {
    scrollWidthRef.current = windowWidth;
    setScrollWidth(windowWidth);
    centerCategory(activeCat, false);
  }, [windowWidth, activeCat, centerCategory]);

  return {
    categoryScrollRef,
    handleCategoryPress,
    handleCategoryLayout,
    handleContainerLayout,
    handleContentSizeChange,
    centerCategory,
  };
}
