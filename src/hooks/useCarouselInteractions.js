import { useEffect, useRef, useState } from "react";

const DRAG_THRESHOLD = 90;
const CLICK_SUPPRESSION_THRESHOLD = 12;
const MAX_DRAG_OFFSET = 180;

function useCarouselInteractions({ onPrevious, onNext }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const suppressClickRef = useRef(false);
  const clickSuppressionTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (clickSuppressionTimeoutRef.current !== null) {
        window.clearTimeout(clickSuppressionTimeoutRef.current);
      }
    };
  }, []);

  function armClickSuppression() {
    suppressClickRef.current = true;

    if (clickSuppressionTimeoutRef.current !== null) {
      window.clearTimeout(clickSuppressionTimeoutRef.current);
    }

    clickSuppressionTimeoutRef.current = window.setTimeout(() => {
      suppressClickRef.current = false;
      clickSuppressionTimeoutRef.current = null;
    }, 0);
  }

  function resetDrag(event) {
    if (
      event?.currentTarget?.hasPointerCapture?.(activePointerIdRef.current) &&
      activePointerIdRef.current !== null
    ) {
      event.currentTarget.releasePointerCapture(activePointerIdRef.current);
    }

    dragStartXRef.current = 0;
    dragOffsetRef.current = 0;
    isDraggingRef.current = false;
    activePointerIdRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
  }

  function finishDrag(event) {
    if (
      activePointerIdRef.current !== null &&
      event?.pointerId !== undefined &&
      event.pointerId !== activePointerIdRef.current
    ) {
      return;
    }

    const deltaX = dragOffsetRef.current;
    const movedEnoughToSuppressClick =
      isDraggingRef.current &&
      Math.abs(deltaX) >= CLICK_SUPPRESSION_THRESHOLD;

    if (movedEnoughToSuppressClick) {
      armClickSuppression();
    }

    if (isDraggingRef.current && Math.abs(deltaX) >= DRAG_THRESHOLD) {
      if (deltaX < 0) {
        onNext();
      } else {
        onPrevious();
      }
    }

    resetDrag(event);
  }

  function cancelDrag(event) {
    resetDrag(event);
  }

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragStartXRef.current = event.clientX;
    dragOffsetRef.current = 0;
    isDraggingRef.current = false;
    activePointerIdRef.current = event.pointerId;
    setDragOffset(0);
    setIsDragging(false);
  }

  function handlePointerMove(event) {
    if (event.pointerId !== activePointerIdRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;

    if (!isDraggingRef.current && Math.abs(deltaX) < CLICK_SUPPRESSION_THRESHOLD) {
      return;
    }

    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    const constrainedOffset = Math.max(
      -MAX_DRAG_OFFSET,
      Math.min(MAX_DRAG_OFFSET, deltaX),
    );

    dragOffsetRef.current = constrainedOffset;
    setDragOffset(constrainedOffset);
  }

  function preventClickAfterDrag(event) {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  return {
    isDragging,
    dragOffset,
    preventClickAfterDrag,
    interactionHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: cancelDrag,
    },
  };
}

export default useCarouselInteractions;
