import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { skillGroups } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const SkillPill = ({ name, icon }) => (
  <span className="inline-flex items-center gap-2 bg-tertiary rounded-full pl-3 pr-4 py-2 text-white text-fluid-label font-medium">
    {icon && (
      <img src={icon} alt="" className="w-5 h-5 object-contain shrink-0" />
    )}
    {name}
  </span>
);

SkillPill.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I work with</p>
        <h2 className={styles.sectionHeadText}>Skills.</h2>
      </motion.div>

      <div className="mt-16 flex flex-col gap-10">
        {skillGroups.map((group, index) => (
          <motion.div
            key={group.category}
            variants={fadeIn("up", "spring", index * 0.1, 0.6)}
          >
            <h3 className="text-secondary uppercase tracking-wider text-fluid-label font-semibold mb-4">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-3">
              {group.skills.map((skill) => (
                <SkillPill key={skill.name} name={skill.name} icon={skill.icon} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

const WrappedTech = SectionWrapper(Tech, "");
export default WrappedTech;
