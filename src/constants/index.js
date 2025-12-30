import {
  csharp,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  tailwind,
  nodejs,
  mongodb,
  git,
  docker,
  medicalMedia,
  konimbo,
  mizrahi,
  saas,
  cart,
  JobInterviewAI,
  LearnToWrite,
  LearningPlatform,
  carShop,
  angular,
  net,
  sql,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
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

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Angular",
    icon: angular,
  },
  {
    name: ".net",
    icon: net,
  },
  {
    name: "Sql",
    icon: sql,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  // {
  //   name: "Redux Toolkit",
  //   icon: redux,
  // },
  {
    name: "git",
    icon: git,
  },
  // {
  //   name: "Three JS",
  //   icon: threejs,
  // },
  // {
  //   name: "figma",
  //   icon: figma,
  // },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Software Developer | API Automation (NestJS / Next.js)",
    company_name: "Mizrahi-Tefahot Bank",
    icon: mizrahi,
    iconBg: "#E6DEDD",
    date: "05/2025 – Present",
    points: [
      "Developing enterprise-grade banking solutions and internal developer tools to improve efficiency and accelerate delivery.Responsible for designing and maintaining scalable RESTful APIs in .NET, managing OpenAPI/Swagger specifications, and leading innovation in API automation.Played a key role in building a proprietary API Discovery & Automation platform using NestJS and Next.js, enabling visualization of system relationships, simplified creation and editing of API specs (even for non-technical staff), and ensuring API quality through validation, automated mapping, and integration with SwaggerHub — significantly improving DevEx and speeding development cycles.",
    ],
  },
  {
    title: "Web Support & Implementation Specialist",
    company_name: "Konimbo",
    icon: konimbo,
    iconBg: "#383E56",
    date: "04/2024 - 04/2025",
    points: [
      "Providing comprehensive support for websites based on the Konimbo platform, including system training and guidance, technical troubleshooting, and custom adjustments. This also involves advanced design and enhancement of user experience using HTML, CSS, and JavaScript, tailored to each client's unique needs.",
    ],
  },
  {
    title: "Digital Manager & Technical Specialist",
    company_name: "Medical Media",
    icon: medicalMedia,
    iconBg: "#E6DEDD",
    date: "12/2022 – 04/2024",
    points: [
      "Joined the company as a Training & Support Specialist, responsible for onboarding managers and teams to the company’s systems, delivering advanced technical support, and producing analytical performance reports to drive operational improvement. In 2023, I was promoted to Digital Manager, where I led data-driven digital initiatives, developed and automated smart landing pages to improve conversion funnels, managed technology projects and virtual events, and defined clear technical scopes while continuously optimizing user experience and engagement based on performance analytics",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "Orel’s coding skills are so sharp, I almost considered rewriting Windows in Angular. Almost.",
    name: "Satya Nadella",
    designation: "CEO",
    company: "Microsoft",
    image: "/src/assets/SatyaNadella.jpg",
  },
  {
    testimonial:
      "Orel is a full-stack wizard! His ability to craft seamless and scalable applications is truly out of this world. If I had him at SpaceX, we'd probably be coding our way to Mars by now!",
    name: "Elon Musk",
    designation: "CEO",
    company: "Tesla & SpaceX",
    image: "/src/assets/ElonMusk.jpg",
  },
  {
    testimonial:
      "I've worked with many developers, but Orel's expertise in React and Node.js is simply unparalleled. If Apple hired him, iOS would probably run on JavaScript by now!",
    name: "Tim Cook",
    designation: "CEO",
    company: "Apple",
    image: "/src/assets/TimCook.jpg",
  },
];

const projects = [
  {
    name: "Saas AI",
    description:
      "🤖 AI-Powered Creativity – A revolutionary SaaS platform that transforms ideas into digital content. 🎨 Engaging Media – Generate text, stunning images, videos, and immersive audio with AI precision.🚀 Unleash Innovation – An intuitive and powerful tool to craft, create, and bring visions to life.",
    tags: [
      {
        name: "Next",
        color: "blue-text-gradient",
      },
      {
        name: "Prisma",
        color: "green-text-gradient",
      },
      {
        name: "Tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: saas,
    source_code_link: "https://github.com/Orel009/MediaCraftAI",
  },
  {
    name: "Learning Platform (Angular / .NET / SQL)",
    description:
      "🎓 Smart Learning Platform – A dynamic web system for seamless course management and learning.🛠 Admin Control – Upload, organize, and manage courses effortlessly.📚 User Experience – Browse, save, and track learning progress with ease.",
    tags: [
      {
        name: "Angular",
        color: "blue-text-gradient",
      },
      {
        name: "TypeScript",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
      {
        name: ".NET",
        color: "orange-text-gradient",
      },
      {
        name: "SQL",
        color: "yellow-text-gradient",
      },
    ],
    image: LearningPlatform,
    source_code_link: "https://github.com/Orel009/Learning-Platform.git",
  },
  {
    name: "Car Sales Platform (Angular / .NET / SQL)",
    description:
      "🚗 Car Sales Platform – A sleek web app showcasing a detailed and organized vehicle catalog.🛠 Admin Control – Add, edit, and remove cars with full management access.📊 Smart Insights – View most-watched cars and real-time engagement stat",
    tags: [
      {
        name: "Angular",
        color: "blue-text-gradient",
      },
      {
        name: "TypeScript",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
      {
        name: ".NET",
        color: "orange-text-gradient",
      },
      {
        name: "SQL",
        color: "yellow-text-gradient",
      },
    ],
    image: carShop,
    source_code_link: "https://github.com/Orel009/Car-store-.git",
  },
  {
    name: "Shop",
    description:
      "💻 Innovative Marketplace – A dynamic online shopping platform built with JavaScript at its core. 🛒 Effortless Shopping – Seamlessly add products to your cart, curate favorites, and complete purchases. ✨ Enhanced Experience – Designed for intuitive navigation, ensuring a smooth e-commerce journe",
    tags: [
      {
        name: "JavaScript",
        color: "blue-text-gradient",
      },
      {
        name: "Html",
        color: "green-text-gradient",
      },
      {
        name: "Css",
        color: "pink-text-gradient",
      },
    ],
    image: cart,
    source_code_link: "https://github.com/Orel009/Gaming-store-basic",
  },
  {
    name: "Job InterviewAI",
    description:
      "🚀 Practice Interviews – Train with AI-driven mock interviews tailored to your industry. 📊 Personalized Feedback – Get instant analysis and insights on your responses and delivery. ❓ Question Library – Explore a vast collection of common and industry-specific interview questions.",
    tags: [
      {
        name: "Angular",
        color: "blue-text-gradient",
      },
      {
        name: "TypeScript",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: JobInterviewAI,
    source_code_link: "https://github.com/Orel009/Job-Interview-AI-",
  },

  {
    name: "Learn ToWrite",
    description:
      "📝 Learn to Write – Improve your writing skills with our interactive learning platform. ✏️ Practice Daily – Engage in structured exercises designed to enhance your writing abilities.📚 Master Techniques – Develop essential skills in various writing styles and techniques.",
    tags: [
      {
        name: "Angular",
        color: "blue-text-gradient",
      },
      {
        name: "TypeScript",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: LearnToWrite,
    source_code_link: "https://github.com/Orel009/LearnToWrite",
  },
];

export { services, technologies, experiences, testimonials, projects };
