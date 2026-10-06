import { useState, useRef, useCallback, useEffect } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  DeviceEventEmitter,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export function useExploreSearchBarAnimation(navigation, headerHeight, isLoadingMoreRef) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const dismissSearchFocus = useCallback(() => {
    Keyboard.dismiss();
    searchInputRef.current?.blur();
    setIsSearchFocused(false);
  }, []);

  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const isSearchBarVisibleRef = useRef(true);
  const lastScrollY = useRef(0);
  const isSearchFocusedRef = useRef(false);
  const idleTimerRef = useRef(null);

  const hideSearchBar = useCallback(() => {
    if (isSearchFocusedRef.current || !isSearchBarVisibleRef.current) return;
    if (lastScrollY.current <= 20) return;
    isSearchBarVisibleRef.current = false;
    setIsSearchBarVisible(false);
    Animated.timing(searchBarAnim, {
      toValue: 1,
      duration: 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [searchBarAnim]);

  const showSearchBar = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (!isSearchBarVisibleRef.current) {
      isSearchBarVisibleRef.current = true;
      setIsSearchBarVisible(true);
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [searchBarAnim]);

  useEffect(() => {
    isSearchFocusedRef.current = isSearchFocused;
    if (isSearchFocused) {
      showSearchBar();
    }
  }, [isSearchFocused, showSearchBar]);

  useEffect(() => {
    DeviceEventEmitter.emit("exploreSearchBarVisible", isSearchBarVisible);
    navigation.setParams({ isSearchBarVisible });
  }, [isSearchBarVisible, navigation]);

  useEffect(() => {
    const handleKeyboardHide = () => {
      searchInputRef.current?.blur();
      setIsSearchFocused(false);
    };
    const didHideSub = Keyboard.addListener("keyboardDidHide", handleKeyboardHide);
    const willHideSub = Keyboard.addListener("keyboardWillHide", handleKeyboardHide);
    return () => {
      didHideSub.remove();
      willHideSub.remove();
    };
  }, []);

  const handleScroll = useCallback((event) => {
    if (isLoadingMoreRef?.current) return;
    const { nativeEvent } = event;
    const currentY = nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (currentY <= 20) {
      if (!isSearchBarVisibleRef.current) {
        showSearchBar();
      }
    } else if (diff > 12 && currentY > 60) {
      if (!isSearchFocusedRef.current && isSearchBarVisibleRef.current) {
        hideSearchBar();
      }
    } else if (diff < -15) {
      if (!isSearchBarVisibleRef.current) {
        showSearchBar();
      }
    }

    lastScrollY.current = currentY;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (!isSearchBarVisibleRef.current) {
      idleTimerRef.current = setTimeout(() => {
        showSearchBar();
      }, 3000);
    }
  }, [hideSearchBar, showSearchBar, isLoadingMoreRef]);

  const handleScrollBeginDrag = useCallback(() => {
    dismissSearchFocus();
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, [dismissSearchFocus]);

  const handleScrollEnd = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (!isSearchBarVisibleRef.current) {
      idleTimerRef.current = setTimeout(() => {
        showSearchBar();
      }, 3000);
    }
  }, [showSearchBar]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  const searchTranslateY = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -headerHeight],
  });

  const searchOpacity = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  useFocusEffect(
    useCallback(() => {
      showSearchBar();
      DeviceEventEmitter.emit("exploreSearchBarVisible", true);
      return () => {
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
          idleTimerRef.current = null;
        }
        dismissSearchFocus();
      };
    }, [showSearchBar, dismissSearchFocus])
  );

  return {
    isSearchFocused,
    setIsSearchFocused,
    searchInputRef,
    dismissSearchFocus,
    isSearchBarVisible,
    searchTranslateY,
    searchOpacity,
    handleScroll,
    handleScrollBeginDrag,
    handleScrollEnd,
  };
}

export default useExploreSearchBarAnimation;
