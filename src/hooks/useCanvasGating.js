import { useEffect, useRef, useState } from "react";

const TINY_QUERY = "(max-width: 449px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Shared visibility/perf gating for the background 3D scenes (Earth, Stars).
// - `shouldMount` flips true the first time the container nears the
//   viewport and never flips back — so the scene lazy-mounts once (no
//   repeated GLTF/texture refetching) instead of gating every render.
// - `shouldRender` reflects live in-view + tab-visible state, for pausing
//   the render loop (not unmounting) when scrolled away or backgrounded.
export function useCanvasGating() {
  const containerRef = useRef(null);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const [isTiny, setIsTiny] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // No IntersectionObserver support: mount and render unconditionally
      // rather than never mounting at all.
      setHasIntersected(true);
      setIsIntersecting(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) setHasIntersected(true);
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const tinyQuery = window.matchMedia(TINY_QUERY);
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    setIsTiny(tinyQuery.matches);
    setPrefersReducedMotion(motionQuery.matches);

    const handleTiny = (e) => setIsTiny(e.matches);
    const handleMotion = (e) => setPrefersReducedMotion(e.matches);
    tinyQuery.addEventListener("change", handleTiny);
    motionQuery.addEventListener("change", handleMotion);
    return () => {
      tinyQuery.removeEventListener("change", handleTiny);
      motionQuery.removeEventListener("change", handleMotion);
    };
  }, []);

  return {
    containerRef,
    shouldMount: hasIntersected,
    shouldRender: isIntersecting && isTabVisible,
    isTiny,
    prefersReducedMotion,
  };
}
