import { useState, TouchEvent } from 'react';

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  startTime: number;
  isSwiping: boolean;
}

const SWIPE_THRESHOLD = 100; // Minimum distance in px
const MAX_DURATION = 300; // Maximum duration in ms
const EDGE_THRESHOLD = 50; // Must start swipe within 50px of left edge

export function useSwipeGesture(onSwipeRight: () => void) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    startTime: 0,
    isSwiping: false
  });

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    
    // Only start tracking if touch begins near left edge
    if (touch.clientX > EDGE_THRESHOLD) return;

    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      startTime: Date.now(),
      isSwiping: true
    });
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!swipeState.isSwiping) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeState.startX;
    const deltaY = Math.abs(touch.clientY - swipeState.startY);

    // Cancel if vertical movement is too large (likely scrolling)
    if (deltaY > 30) {
      setSwipeState(prev => ({ ...prev, isSwiping: false }));
      return;
    }

    // Only allow right swipes
    if (deltaX > 0) {
      setSwipeState(prev => ({ ...prev, currentX: touch.clientX }));
    }
  };

  const onTouchEnd = () => {
    if (!swipeState.isSwiping) return;

    const deltaX = swipeState.currentX - swipeState.startX;
    const duration = Date.now() - swipeState.startTime;

    // Check if swipe meets criteria
    if (deltaX >= SWIPE_THRESHOLD && duration <= MAX_DURATION) {
      onSwipeRight();
    }

    setSwipeState({
      startX: 0,
      startY: 0,
      currentX: 0,
      startTime: 0,
      isSwiping: false
    });
  };

  const translateX = swipeState.isSwiping 
    ? Math.max(0, swipeState.currentX - swipeState.startX) 
    : 0;

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    translateX,
    isSwiping: swipeState.isSwiping
  };
}
