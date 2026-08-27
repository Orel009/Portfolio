import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import PropTypes from "prop-types";
import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={0.2} groundColor="black" />
      <pointLight intensity={18} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.25]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

Computers.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

// A lightweight static stand-in for the WebGL scene on very small screens,
// where a phone's GPU/battery shouldn't be spent on a full three.js render.
const HeroFallback = () => (
  <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
    <svg
      viewBox="0 0 200 160"
      className="w-2/3 max-w-[220px] h-auto"
      role="img"
    >
      <rect x="30" y="20" width="140" height="90" rx="8" fill="#151030" stroke="#915eff" strokeWidth="3" />
      <rect x="42" y="32" width="116" height="66" rx="3" fill="#050816" />
      <path d="M62 55 L50 65 L62 75" stroke="#915eff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M138 55 L150 65 L138 75" stroke="#915eff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M92 78 L108 52" stroke="#aaa6c3" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="85" y="110" width="30" height="10" fill="#151030" />
      <rect x="60" y="120" width="80" height="8" rx="4" fill="#151030" />
    </svg>
  </div>
);

const ComputerCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTiny, setIsTiny] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 500px)");
    // Matches the `xs` Tailwind breakpoint (tailwind.config.js) — below it,
    // skip mounting WebGL entirely rather than just shrinking the scene.
    const tinyQuery = window.matchMedia("(max-width: 449px)");

    setIsMobile(mobileQuery.matches);
    setIsTiny(tinyQuery.matches);

    const handleMobileChange = (e) => setIsMobile(e.matches);
    const handleTinyChange = (e) => setIsTiny(e.matches);

    mobileQuery.addEventListener("change", handleMobileChange);
    tinyQuery.addEventListener("change", handleTinyChange);

    return () => {
      mobileQuery.removeEventListener("change", handleMobileChange);
      tinyQuery.removeEventListener("change", handleTinyChange);
    };
  }, []);

  if (isTiny) {
    return <HeroFallback />;
  }

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={isMobile ? 1 : [1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputerCanvas;
