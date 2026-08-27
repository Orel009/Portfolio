import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import PropTypes from "prop-types";

import CanvasLoader from "../Loader";
import CanvasErrorBoundary from "./CanvasErrorBoundary";
import { useCanvasGating } from "../../hooks/useCanvasGating";
import { isWebGLAvailable } from "../../utils/webgl";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");

  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

// Filled slot in Contact's two-column layout, so "no WebGL" must still fill
// the space rather than leaving a visible gap.
const EarthFallback = () => (
  <div
    className="w-full h-full flex items-center justify-center"
    aria-hidden="true"
  >
    <svg viewBox="0 0 160 160" className="w-1/2 max-w-[180px] h-auto" role="img">
      <circle cx="80" cy="80" r="64" className="fill-tertiary stroke-accent" strokeWidth="3" />
      <path
        d="M24 80 H136 M80 16 V144 M40 40 Q80 70 120 40 M40 120 Q80 90 120 120"
        className="stroke-accent"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
    </svg>
  </div>
);

const EarthScene = ({ isTiny, prefersReducedMotion, shouldRender }) => (
  <Canvas
    shadows
    frameloop={shouldRender ? "demand" : "never"}
    dpr={isTiny ? 1 : [1, 2]}
    gl={{ preserveDrawingBuffer: true }}
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
  >
    <Suspense fallback={<CanvasLoader />}>
      {/* autoRotate keeps invalidating every frame even in "demand" mode,
          which defeats the point of capping cost on small screens — drag
          rotation stays available everywhere, since it's bounded by real
          interaction events rather than a continuous animation loop. */}
      <OrbitControls
        autoRotate={!prefersReducedMotion && !isTiny}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      <Earth />
      <Preload all />
    </Suspense>
  </Canvas>
);

EarthScene.propTypes = {
  isTiny: PropTypes.bool.isRequired,
  prefersReducedMotion: PropTypes.bool.isRequired,
  shouldRender: PropTypes.bool.isRequired,
};

const EarthCanvas = () => {
  const { containerRef, shouldMount, shouldRender, isTiny, prefersReducedMotion } =
    useCanvasGating();

  return (
    <div ref={containerRef} className="w-full h-full">
      {!isWebGLAvailable() ? (
        <EarthFallback />
      ) : shouldMount ? (
        <CanvasErrorBoundary fallback={<EarthFallback />}>
          <EarthScene
            isTiny={isTiny}
            prefersReducedMotion={prefersReducedMotion}
            shouldRender={shouldRender}
          />
        </CanvasErrorBoundary>
      ) : null}
    </div>
  );
};

export default EarthCanvas;
