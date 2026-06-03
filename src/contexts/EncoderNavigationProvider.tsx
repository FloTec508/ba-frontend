import { ReactNode, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "[role=button]:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable=true]",
  "[tabindex]",
].join(",");

const isElementVisible = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  return style.visibility !== "hidden" && style.display !== "none" && element.getClientRects().length > 0;
};

const isElementInViewport = (element: HTMLElement, container: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  // Check if element is within container's viewport
  // Allow partial visibility (element only needs to be partially in view)
  return !(
    rect.bottom < containerRect.top ||      // Element is above container
    rect.top > containerRect.bottom ||      // Element is below container
    rect.right < containerRect.left ||      // Element is left of container
    rect.left > containerRect.right         // Element is right of container
  );
};

const isElementInWindowViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  
  // Allow partial visibility in the window
  return !(
    rect.bottom < 0 ||                    // Element is above window
    rect.top > window.innerHeight ||      // Element is below window
    rect.right < 0 ||                     // Element is left of window  
    rect.left > window.innerWidth         // Element is right of window
  );
};

const getScrollableParent = (element: HTMLElement): HTMLElement | null => {
  let parent = element.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const isScrollable = 
      (style.overflowY === "auto" || style.overflowY === "scroll" || style.overflow === "auto" || style.overflow === "scroll") ||
      (style.overflowX === "auto" || style.overflowX === "scroll");
    
    if (isScrollable) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
};

const getActiveModal = (): HTMLElement | null => {
  // Look for visible modal with z-50 class (from Modal component)
  const modals = document.querySelectorAll<HTMLElement>('[class*="z-50"]');
  for (const modal of modals) {
    // Check if this looks like a modal backdrop/container
    const style = window.getComputedStyle(modal);
    if (style.position === "fixed" && modal.offsetHeight > 0 && modal.offsetWidth > 0) {
      // Found an active modal, now find the inner content container
      const content = modal.querySelector<HTMLElement>('[class*="rounded-2xl"], [role="dialog"], [role="alertdialog"]');
      if (content) return content;
      return modal;
    }
  }
  return null;
};

const getFocusableElements = (root: HTMLElement) => {
  // If a modal is open, only search within the modal
  const activeModal = getActiveModal();
  const searchRoot = activeModal || root;
  
  return Array.from(searchRoot.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter((element) => {
    if (element.hasAttribute("disabled")) return false;
    if (element.getAttribute("aria-hidden") === "true") return false;
    if (element.hasAttribute("nofocus")) return false;
    if (element.tabIndex < 0) return false;
    if (!isElementVisible(element)) return false;
    
    // Skip items in overlay containers (Player, OverlayVolume, etc)
    // unless a modal is actively open
    if (!activeModal) {
      let parent = element.parentElement;
      while (parent) {
        if (parent.getAttribute("data-overlay") === "true") {
          return false;
        }
        parent = parent.parentElement;
      }
    }
    
    // Check if element is in viewport of its scrollable parent
    const scrollParent = getScrollableParent(element);
    if (scrollParent) {
      if (!isElementInViewport(element, scrollParent)) {
        return false;
      }
    } else {
      // No scrollable parent, check if element is in window viewport
      if (!isElementInWindowViewport(element)) {
        return false;
      }
    }
    return true;
  });
};

const focusElement = (element: HTMLElement) => {
  if (element.tabIndex < 0) {
    element.tabIndex = 0;
  }
  element.focus({ preventScroll: false });
  if (typeof element.scrollIntoView === "function") {
    element.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
};

const focusNextElement = (root: HTMLElement, direction: 1 | -1) => {
  const focusable = getFocusableElements(root);
  if (!focusable.length) return;

  const activeElement = document.activeElement as HTMLElement | null;
  // Check if active element still exists in DOM and is in current focusable list
  const isActiveElementValid = activeElement && root.contains(activeElement) && focusable.includes(activeElement);
  const currentIndex = isActiveElementValid ? focusable.indexOf(activeElement) : -1;
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + focusable.length) % focusable.length;

  focusElement(focusable[nextIndex]);
};

const clickActiveElement = () => {
  const activeElement = document.activeElement as HTMLElement | null;
  if (!activeElement || activeElement === document.body) return;
  if (typeof activeElement.click === "function") {
    activeElement.click();
  }
};

const isEncoderClickEvent = (eventType: string) => eventType === "encoder/click" || eventType === "encoder/press";

export default function EncoderNavigationProvider({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const action = useSelector((state: any) => state.event);

  // Reset focus when page/route changes
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    
    // Use setTimeout to ensure DOM is fully rendered after route change
    const timeoutId = setTimeout(() => {
      // Get first focusable element and focus it
      const focusable = getFocusableElements(root);
      if (focusable.length > 0) {
        focusElement(focusable[0]);
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !action?.event) return;

    if (action.event == "command") {
      const direction = action.payload.action || "" as string;
      if (direction === "down" || direction === "right") {
        focusNextElement(root, 1);
      } else if (direction === "up" || direction === "left") {
        focusNextElement(root, -1);
      }
    }

    if (isEncoderClickEvent(action.event)) {
      clickActiveElement();
    }
  }, [action]);

  return (
    <div ref={rootRef} className="flex flex-col h-full relative">
      {children}
    </div>
  );
}
