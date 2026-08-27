import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import PropTypes from "prop-types";

import CanvasErrorBoundary from "./CanvasErrorBoundary";
import { useCanvasGating } from "../../hooks/useCanvasGating";
import { isWebGLAvailable } from "../../utils/webgl";

const TINY_STAR_COUNT = 1500;
const FULL_STAR_COUNT = 5000;
const TINY_SCREEN_FPS_CAP = 24;

// On tiny screens, capping the visual update rate isn't enough — R3F's
// "always" frameloop still issues a real draw call every display refresh
// regardless of whether anything moved. The only way to genuinely cap the
// GPU cost is to run in "demand" mode (which only renders in response to
// invalidate()) and drive our own throttled invalidate() calls, instead of
// letting the continuous "always" loop run unthrottled.
function useThrottledInvalidate(active, fps) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => invalidate(), 1000 / fps);
    return () => clearInterval(id);
  }, [active, fps, invalidate]);
}

const Stars = ({ isTiny, prefersReducedMotion, shouldRender, ...props }) => {
  const ref = useRef();
  const starCount = isTiny ? TINY_STAR_COUNT : FULL_STAR_COUNT;
  // maath's inSphere writes 3 floats (x/y/z) per point in a loop stepping by
  // 3 — the original code passed a buffer sized by star *count* directly
  // (`new Float32Array(5000)`, not divisible by 3), so its last point wrote
  // one coordinate out of bounds. TypedArrays silently drop out-of-bounds
  // writes rather than throwing, which combined with the `radius: 1.2`
  // option actually taking effect now (it was a no-op typo before,
  // `redius`) surfaced as a `computeBoundingSphere(): NaN` warning. Sizing
  // the buffer as `starCount * 3` fixes the real cause.
  const sphere = useMemo(
    () => random.inSphere(new Float32Array(starCount * 3), { radius: 1.2 }),
    [starCount]
  );

  useThrottledInvalidate(
    shouldRender && isTiny && !prefersReducedMotion,
    TINY_SCREEN_FPS_CAP
  );

  useFrame((_state, delta) => {
    if (prefersReducedMotion || !ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

Stars.propTypes = {
  isTiny: PropTypes.bool.isRequired,
  prefersReducedMotion: PropTypes.bool.isRequired,
  shouldRender: PropTypes.bool.isRequired,
};

function frameloopFor({ shouldRender, isTiny, prefersReducedMotion }) {
  // "never" truly means never — R3F won't even respond to invalidate()
  // calls in that mode (you'd have to call `advance()` yourself), so it's
  // reserved for the fully-paused off-screen/tab-hidden case. "demand"
  // does respond to invalidate(), which is what the manual throttle above
  // needs to actually produce a render.
  if (!shouldRender) return "never";
  if (prefersReducedMotion) return "demand"; // one static render, no drift
  if (isTiny) return "demand"; // driven manually by useThrottledInvalidate
  return "always";
}

const StarsCanvas = () => {
  const { containerRef, shouldMount, shouldRender, isTiny, prefersReducedMotion } =
    useCanvasGating();

  if (!isWebGLAvailable()) {
    // Purely decorative background layer — no WebGL means no starfield,
    // not a gap, since nothing else occupies this space.
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-auto absolute inset-0 z-[-1] pointer-events-none"
    >
      {shouldMount && (
        <CanvasErrorBoundary fallback={null}>
          <Canvas
            frameloop={frameloopFor({ shouldRender, isTiny, prefersReducedMotion })}
            dpr={isTiny ? 1 : [1, 2]}
            gl={{ preserveDrawingBuffer: true }}
            camera={{ position: [0, 0, 1] }}
          >
            <Suspense fallback={null}>
              <Stars
                isTiny={isTiny}
                prefersReducedMotion={prefersReducedMotion}
                shouldRender={shouldRender}
              />
            </Suspense>
            <Preload all />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  );
};

export default StarsCanvas;
