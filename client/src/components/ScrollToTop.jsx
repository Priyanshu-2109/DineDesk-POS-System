import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smooth scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // Alternative: Instant scroll for faster navigation (uncomment if preferred)
    // window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Utility function for smooth scroll to top that can be used anywhere
export const scrollToTop = (behavior = "smooth") => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: behavior,
  });
};

// Utility function for smooth scroll to element
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
};

export default ScrollToTop;
