import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import PropTypes from "prop-types";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects, personalInfo } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Cycled by index instead of stored per-tag in content data — removes an
// entire class of "typo'd gradient class name" bugs (the previous data had
// one: `yellow-text-gradient` was referenced but never defined in CSS).
const TAG_GRADIENTS = [
  "blue-text-gradient",
  "green-text-gradient",
  "pink-text-gradient",
  "orange-text-gradient",
  "yellow-text-gradient",
];

const TagList = ({ tags }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag, i) => (
      <p key={tag} className={`text-fluid-label ${TAG_GRADIENTS[i % TAG_GRADIENTS.length]}`}>
        #{tag}
      </p>
    ))}
  </div>
);

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// A project can have zero, one, or several source repos (e.g. a separate
// frontend/backend). No links renders no overlay at all, rather than a
// button that opens `undefined`; one or many render as same-size icon
// buttons in a row, each opening its own repo.
const SourceLinksRow = ({ name, sourceLinks }) => {
  if (!sourceLinks || sourceLinks.length === 0) return null;
  return (
    <div className="absolute inset-0 flex justify-end items-start gap-2 m-3">
      {sourceLinks.map((link) => (
        <button
          key={link.url}
          type="button"
          aria-label={
            link.label
              ? `Open ${link.label} source for ${name} on GitHub`
              : `Open source code for ${name} on GitHub`
          }
          onClick={() => window.open(link.url, "_blank")}
          className="black-gradient w-11 h-11 rounded-full flex justify-center items-center"
        >
          <img src={github} alt="" className="w-1/2 h-1/2 object-contain" />
        </button>
      ))}
    </div>
  );
};

SourceLinksRow.propTypes = {
  name: PropTypes.string.isRequired,
  sourceLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string.isRequired,
    })
  ),
};

// Standing in for a real screenshot when a project has none (proprietary
// work, or no snapshot supplied yet) — an on-brand placeholder rather than
// a broken <img> or a blank box. Its wrapper is shorter below the
// breakpoint where cards stack (image above text, full viewport width)
// than above it (image beside text, sharing horizontal space) — a
// low-information placeholder costs real scroll length once it can't
// share width with content; a real image keeps its full height everywhere.
const ImagePlaceholder = ({ name }) => (
  <div className="w-full h-full rounded-2xl bg-black-gradient flex items-center justify-center px-4">
    <span className="text-secondary text-fluid-label uppercase tracking-wider text-center">
      {name}
    </span>
  </div>
);

ImagePlaceholder.propTypes = {
  name: PropTypes.string.isRequired,
};

const ProjectCard = ({ index, name, description, tags, image, sourceLinks }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className={`relative w-full ${image ? "h-[230px]" : "h-24 sm:h-[230px]"}`}>
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <ImagePlaceholder name={name} />
          )}
          <SourceLinksRow name={name} sourceLinks={sourceLinks} />
        </div>
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="m-2 text-secondary text-fluid-label">{description}</p>
        </div>
        <TagList tags={tags} />
      </Tilt>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  image: PropTypes.string,
  sourceLinks: SourceLinksRow.propTypes.sourceLinks,
};

const FeaturedProjectCard = ({
  name,
  subtitle,
  description,
  highlights,
  tags,
  image,
  sourceLinks,
}) => (
  <motion.div
    variants={fadeIn("up", "spring", 0, 0.75)}
    className="w-full bg-tertiary rounded-2xl p-6 sm:p-10 flex flex-col lg:flex-row gap-8"
  >
    <div
      className={`relative w-full lg:w-2/5 shrink-0 ${
        image ? "h-[220px]" : "h-28 lg:h-[220px]"
      }`}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-2xl"
        />
      ) : (
        <ImagePlaceholder name={name} />
      )}
      <SourceLinksRow name={name} sourceLinks={sourceLinks} />
    </div>
    <div className="flex-1">
      <p className="text-secondary text-fluid-label uppercase tracking-wider">
        Featured project
      </p>
      <h3 className="text-white font-bold text-[28px] mt-1">{name}</h3>
      <p className="text-secondary text-fluid-label mt-1">{subtitle}</p>
      <p className="text-secondary text-fluid-body mt-4">{description}</p>
      <ul className="mt-5 list-disc ml-5 space-y-3">
        {highlights.map((point) => (
          <li key={point} className="text-white-100 text-fluid-label tracking-wide">
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <TagList tags={tags} />
      </div>
    </div>
  </motion.div>
);

FeaturedProjectCard.propTypes = {
  name: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string.isRequired,
  highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  image: PropTypes.string,
  sourceLinks: SourceLinksRow.propTypes.sourceLinks,
};

// A project's sourceLinks only render once `sourceLinksVerified` is true —
// see constants/index.js. Keeps the "don't link to a repo with a live
// secret in its history" rule enforced at the data layer, not just by
// remembering to fill in the field later.
function visibleSourceLinks(project) {
  return project.sourceLinksVerified ? project.sourceLinks : null;
}

const Works = () => {
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My Work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-fluid-body max-w-3xl leading-[30px]"
        >
          The following projects showcase my skills and experience through
          real-world examples of my work, from a live production platform to
          enterprise banking infrastructure.
          <a
            href={`${personalInfo.githubUrl}?tab=repositories`}
            className="font-bold underline mt-2"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            MyGitHub{" "}
          </a>
        </motion.p>
      </div>

      {featuredProjects.length > 0 && (
        <div className="mt-20 sm:mt-24 flex flex-col gap-10">
          {featuredProjects.map((project) => (
            <FeaturedProjectCard
              key={project.name}
              {...project}
              sourceLinks={visibleSourceLinks(project)}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-7 sm:gap-10 pb-10">
        {otherProjects.map((project, index) => (
          <ProjectCard
            key={project.name}
            index={index}
            {...project}
            sourceLinks={visibleSourceLinks(project)}
          />
        ))}
      </div>
    </>
  );
};

const WrappedWorks = SectionWrapper(Works, "projects");
export default WrappedWorks;
