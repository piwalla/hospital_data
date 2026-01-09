"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

// Define the order of the main menu items for navigation
const MENU_ORDER = [
  "/dashboard",
  "/timeline",
  "/hospitals",
  "/documents",
  "/chatbot-v2",
  "/counseling",
];

export default function SwipeNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Create a safety zone at the very edge to avoid conflict with back gestures (optional, but good practice)
      // For now, capture any touch.
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchStartX = touchStartRef.current.x;
      const touchStartY = touchStartRef.current.y;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Reset
      touchStartRef.current = null;

      // Thresholds:
      // Minimum swipe distance: 75px (to avoid accidental swipes)
      // Maximum vertical deviation: 50px (to ensure it's a horizontal swipe, not a scroll)
      if (Math.abs(diffX) > 75 && Math.abs(diffY) < 50) {
        
        // Safety Check: Ignore if the swipe started on an interactive element
        const target = e.target as HTMLElement;
        
        // Critical: Exclude Map containers (Leaflet) and horizontal scroll areas
        if (target.closest('.leaflet-container, .no-swipe, input, textarea, [role="slider"]')) {
           return; 
        }

        // Determine current page index
        // We match if the pathname starts with the menu item (to handle sub-pages)
        // But we need to be careful with ordering (e.g. /timeline vs /timeline/1)
        // Since the list is distinct, findIndex is safe.
        const currentIndex = MENU_ORDER.findIndex(path => pathname === path || pathname?.startsWith(path + '/'));
        
        if (currentIndex === -1) return; // Not on a main menu

        // Swipe Left (Finger moves right -> left) => Next Page
        if (diffX > 0) { // Positive diffX means Start > End, so moved left
          if (currentIndex < MENU_ORDER.length - 1) {
            router.push(MENU_ORDER[currentIndex + 1]);
          }
        } 
        // Swipe Right (Finger moves left -> right) => Prev Page
        else {
          if (currentIndex > 0) {
            router.push(MENU_ORDER[currentIndex - 1]);
          }
        }
      }
    };

    // Add event listeners to the window
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pathname, router]);

  return null; // This component handles side effects only
}
