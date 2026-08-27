import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((technology) => (
        <div className="w-28 h-28 p-4" key={technology.name}>
          <img
            src={technology.icon}
            alt={technology.name}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};

const WrappedTech = SectionWrapper(Tech, "");
export default WrappedTech;
