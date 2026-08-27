import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import {
  About,
  Contact,
  Education,
  Experience,
  Hero,
  Navbar,
  Tech,
  Works,
} from "./components";

// Lazy so the three.js/r3f code for this purely decorative scene never
// blocks first paint; loaded on demand rather than in the initial bundle.
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

const App = () => {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <div className="relative z-0 bg-primary">
          <Navbar />
          <main>
            <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
              <Hero />
            </div>
            <About />
            <Experience />
            <Education />
            <Tech />
            <Works />
            <div className="relative z-0">
              <Contact />
              <Suspense fallback={null}>
                <StarsCanvas />
              </Suspense>
            </div>
          </main>
        </div>
      </MotionConfig>
    </BrowserRouter>
  );
};

export default App;
