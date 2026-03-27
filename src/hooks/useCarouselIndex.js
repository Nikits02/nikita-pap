import { useCallback, useEffect, useState } from "react";

function useCarouselIndex({
  itemCount,
  visibleCount = 1,
  loop = false,
  autoplayDelay = null,
  pauseAutoplay = false,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndex = Math.max(0, itemCount - visibleCount);
  const visibleIndex = Math.min(activeIndex, maxIndex);

  useEffect(() => {
    setActiveIndex((currentIndex) => Math.min(currentIndex, maxIndex));
  }, [maxIndex]);

  const goPrevious = useCallback(() => {
    setActiveIndex((currentIndex) => {
      const safeIndex = Math.min(currentIndex, maxIndex);

      if (safeIndex === 0) {
        return loop ? maxIndex : 0;
      }

      return safeIndex - 1;
    });
  }, [loop, maxIndex]);

  const goNext = useCallback(() => {
    setActiveIndex((currentIndex) => {
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
    activeIndex,
    maxIndex,
    setActiveIndex,
    visibleIndex,
    goPrevious,
    goNext,
  };
}

export default useCarouselIndex;
