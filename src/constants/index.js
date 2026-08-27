import {
  csharp,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  reactjs,
  tailwind,
  nodejs,
  git,
  github,
  docker,
  medicalMedia,
  konimbo,
  mizrahi,
  angular,
  net,
  sql,
} from "../assets";

// personal / contact info — the single source of truth for content that used
// to be hardcoded separately in Navbar.jsx, Hero.jsx, About.jsx and Contact.jsx
export const personalInfo = {
  name: "Orel Benbenista",
  firstName: "Orel",
  lastName: "Benbenista",
  role: "Full Stack Engineer",
  location: "Netanya, Israel",
  email: "orelll009@gmail.com",
  phone: "053-831-1626",
  githubUrl: "https://github.com/Orel009",
  // No LinkedIn URL exists anywhere in the previous codebase to carry
  // forward — see RENOVATION_REPORT.md. Leave null until supplied.
  linkedinUrl: null,
  cvUrl: "/Orel-Benbenista-CV.pdf",
};

export const heroTagline = {
  line1: "Full Stack Engineer — deterministic logic decides, AI explains.",
  line2:
    "Building a bank-wide API platform, and my own live AI investment-research platform.",
};

export const aboutText =
  "Full Stack Engineer with extensive experience architecting complex systems, microservices, and RESTful API integrations. End-to-end development in .NET Core / .NET 10, Node.js, React 19, and Angular 18, with expertise in incorporating AI tools, agentic workflows, and automation into engineering practice. Strong product vision focused on DevEx and UI/UX, with a proven track record of Agile collaboration in cross-functional teams.";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "experience",
    title: "Experience",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "C# Developer",
    icon: csharp,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Frontend Developer",
    icon: creator,
  },
];

// Grouped by discipline rather than one flat icon wall. Items with a `icon`
// have a matching existing asset; items without one render as a plain text
// pill — see RENOVATION_REPORT.md for the list of skills with no available
// icon asset (NestJS, FastAPI, Entity Framework Core, Vite, Next.js, Claude,
// Gemini, PostgreSQL, Caddy, Swagger/OpenAPI).
const skillGroups = [
  {
    category: "Backend",
    skills: [
      { name: ".NET Core / .NET 10", icon: net },
      { name: "ASP.NET Core", icon: net },
      { name: "C#", icon: csharp },
      { name: "Node.js", icon: nodejs },
      { name: "NestJS" },
      { name: "FastAPI (Python)" },
      { name: "RESTful APIs" },
      { name: "Microservices" },
      { name: "Entity Framework Core" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React 19", icon: reactjs },
      { name: "Vite" },
      { name: "Next.js" },
      { name: "Angular 18", icon: angular },
      { name: "TypeScript", icon: typescript },
      { name: "JavaScript (ES6+)", icon: javascript },
      { name: "HTML5", icon: html },
      { name: "CSS3 / Tailwind", icon: tailwind },
      { name: "Responsive Design" },
      { name: "UX/UI" },
    ],
  },
  {
    category: "AI & LLM",
    skills: [
      { name: "Multi-provider LLMs (Claude, Gemini)" },
      { name: "Call-site routing" },
      { name: "Structured output / JSON schemas" },
      { name: "Agentic workflows" },
      { name: "Fallback pipelines" },
      { name: "Prompt engineering" },
    ],
  },
  {
    category: "Data",
    skills: [
      { name: "SQL", icon: sql },
      { name: "PostgreSQL" },
      { name: "NoSQL" },
      { name: "ORM mapping" },
      { name: "Data provenance & auditing" },
    ],
  },
  {
    category: "DevOps",
    skills: [
      { name: "Docker & Docker Compose", icon: docker },
      { name: "Caddy" },
      { name: "VPS deployment" },
      { name: "Git", icon: git },
      { name: "GitHub", icon: github },
      { name: "CI/CD" },
      { name: "Swagger / OpenAPI" },
    ],
  },
];

// icon note: no dedicated "Matrix" logo asset exists — reusing the
// Mizrahi-Tefahot mark since that's the client this role is embedded at.
// See RENOVATION_REPORT.md.
const experiences = [
  {
    title: "Software Developer (Core Developer)",
    company_name: "MATRIX (Bank Mizrahi-Tefahot)",
    icon: mizrahi,
    iconBg: "#E6DEDD",
    date: "2025 – Present",
    points: [
      "Led end-to-end greenfield development of a core enterprise platform for bank-wide API mapping and management, built with NestJS and Next.js, replacing SwaggerHub and incorporating AI agents.",
      "Built tooling enabling non-technical stakeholders to author and edit API specifications without writing code, significantly shortening organizational development cycles.",
      "Built a discovery engine visualizing architectural relationships between core banking systems, backend services, and frontend applications.",
      "Implemented strict validation logic, automated object mapping, and direct OpenAPI integrations to prevent human error and guarantee interface reliability.",
      "Partnered with system analysts, architects, and development teams to translate complex business requirements into technical solutions.",
    ],
  },
  {
    title: "Technical Support & Web Developer",
    company_name: "Konimbo",
    icon: konimbo,
    iconBg: "#383E56",
    date: "2024 – 2025",
    points: [
      "Advanced technical support, performance optimizations, and efficiency improvements across core e-commerce platform components.",
      "Custom web development in JavaScript, HTML5, and CSS3.",
      "UX/UI enhancements and tailoring of web interfaces to client requirements.",
    ],
  },
  {
    title: "Digital Manager & Technical Specialist",
    company_name: "Medical Media",
    icon: medicalMedia,
    iconBg: "#E6DEDD",
    date: "2021 – 2024",
    points: [
      "Promoted from technical support to Digital Manager within one year on technical achievement and innovation leadership.",
      "Led technical projects, engineered automated workflows for landing pages and digital communications, and directed data-driven campaigns.",
      "Trained cross-functional teams and management on adopting advanced technology platforms.",
    ],
  },
];

const education = [
  {
    degree: "Full Stack Development Course",
    institution: "John Bryce College",
    date: "2024 – 2025",
  },
  {
    degree: "Practical Software Engineer (Handasai)",
    institution: "ORT Hermelin College",
    date: "2021 – 2024",
  },
];

// `image`, `source_code_link` and `live_link` are all optional — a project
// with none of the three renders with a graceful placeholder instead of a
// broken link or a blank image slot. See ProjectCard/FeaturedProjectCard.
const projects = [
  {
    name: "Financial Center",
    subtitle: "AI-Driven Investment Decision & Research Platform",
    featured: true,
    description:
      "A live, deterministic-first investment research and decision platform: a rules engine computes every numerical decision, cross-validated between Python and .NET, while a multi-provider LLM layer produces structured narrative only — never the numbers themselves.",
    highlights: [
      "Designed and deployed a live microservices system — React 19 + Vite, ASP.NET Core (.NET 10), FastAPI, and PostgreSQL, containerized with Docker Compose behind a Caddy reverse proxy on a VPS.",
      "Deterministic-first AI architecture: a rules engine computes every numerical decision, with cross-validation between Python and .NET. A multi-provider LLM layer (Claude / Gemini, routed per call-site) produces structured narrative only, guarded by JSON schema enforcement, repair-retry, and deterministic fallbacks.",
      "Trading-simulation pipeline with risk gates, a cost model, and benchmark performance tracking across nine time horizons; engine versioning and database-enforced decision-path tagging for full auditability and historical reconstructability.",
    ],
    tags: [
      "React",
      ".NET 10",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "Caddy",
      "Claude",
      "Gemini",
    ],
    image: null,
    source_code_link: null,
    // quant-center.com is live but sits behind HTTP Basic Auth — holding off
    // on linking it until you confirm. See RENOVATION_REPORT.md.
    live_link: null,
  },
  {
    name: "API Discovery & Automation Platform",
    subtitle: "Matrix / Bank Mizrahi-Tefahot",
    featured: false,
    description:
      "A greenfield core enterprise platform for bank-wide API mapping and management, built with NestJS and Next.js to replace SwaggerHub and incorporate AI agents. Includes tooling that lets non-technical stakeholders author and edit API specifications directly, a discovery engine that visualizes relationships between core banking systems, backend services, and frontend applications, and strict validation with automated object mapping and direct OpenAPI integration to guarantee interface reliability.",
    tags: ["NestJS", "Next.js", "TypeScript", "OpenAPI", "AI Agents"],
    image: null,
    // Proprietary work — no public repo and no link by design.
    source_code_link: null,
    live_link: null,
  },
];

export { services, skillGroups, experiences, education, projects };
