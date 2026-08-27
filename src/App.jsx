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
            <Contact />
          </main>
        </div>
      </MotionConfig>
    </BrowserRouter>
  );
};

export default App;
