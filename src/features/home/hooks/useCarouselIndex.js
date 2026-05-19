import { useCallback, useEffect, useState } from "react";

function useCarouselIndex({
  itemCount,
  visibleCount = 1,
  loop = false,
  autoplayDelay = null,
  pauseAutoplay = false,
}) {
  const [storedIndex, setStoredIndex] = useState(0);
  const maxIndex = Math.max(0, itemCount - visibleCount);
  const visibleIndex = Math.min(storedIndex, maxIndex);
  const setActiveIndex = useCallback(
    (nextIndex) => {
      setStoredIndex((currentIndex) => {
        const resolvedIndex =
          typeof nextIndex === "function" ? nextIndex(currentIndex) : nextIndex;

        return Math.max(0, Math.min(resolvedIndex, maxIndex));
      });
    },
    [maxIndex],
  );

  const goPrevious = useCallback(() => {
    setStoredIndex((currentIndex) => {
      const safeIndex = Math.min(currentIndex, maxIndex);

      if (safeIndex === 0) {
        return loop ? maxIndex : 0;
      }

      return safeIndex - 1;
    });
  }, [loop, maxIndex]);

  const goNext = useCallback(() => {
    setStoredIndex((currentIndex) => {
      const safeIndex = Math.min(currentIndex, maxIndex);

      if (safeIndex >= maxIndex) {
        return loop ? 0 : maxIndex;
      }

      return safeIndex + 1;
    });
  }, [loop, maxIndex]);

  useEffect(() => {
    if (!autoplayDelay || pauseAutoplay || maxIndex === 0) {
      return undefined;
    }

    const intervalId = window.setInterval(goNext, autoplayDelay);

    return () => window.clearInterval(intervalId);
  }, [autoplayDelay, goNext, maxIndex, pauseAutoplay]);

  return {
    maxIndex,
    setActiveIndex,
    visibleIndex,
    goPrevious,
    goNext,
  };
}

export default useCarouselIndex;
