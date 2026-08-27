import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { education } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const EducationCard = ({ index, degree, institution, date }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.2, 0.6)}
    className="bg-tertiary rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4"
  >
    <div>
      <h3 className="text-white font-bold text-fluid-body">{degree}</h3>
      <p className="text-secondary text-fluid-label">{institution}</p>
    </div>
    <p className="text-secondary text-fluid-label whitespace-nowrap">{date}</p>
  </motion.div>
);

EducationCard.propTypes = {
  index: PropTypes.number.isRequired,
  degree: PropTypes.string.isRequired,
  institution: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

const Education = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Background</p>
        <h2 className={styles.sectionHeadText}>Education.</h2>
      </motion.div>

      <div className="mt-10 flex flex-col gap-4 max-w-3xl">
        {education.map((item, index) => (
          <EducationCard key={item.degree} index={index} {...item} />
        ))}
      </div>
    </>
  );
};

const WrappedEducation = SectionWrapper(Education, "education");
export default WrappedEducation;
