import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import {
  About,
  Contact,
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
          <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
            <Navbar />
            <Hero />
          </div>
          <About />
          <Experience />
          <Tech />
          <Works />
          <Contact />
        </div>
      </MotionConfig>
    </BrowserRouter>
  );
};

export default App;
