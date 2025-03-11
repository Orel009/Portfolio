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
  saas,
  cart,
  JobInterviewAI,
  LearnToWrite,
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
    title: "Konimbo – Website Support",
    company_name: "Konimbo",
    icon: konimbo,
    iconBg: "#383E56",
    date: "04/2024 - Present",
    points: [
      "Comprehensive support for websites based on the Konimbo platform, including in-depth guidance and training on system usage, alongside handling technical fixes and custom adjustments. Specialized in advanced design and user experience enhancement using HTML, CSS, and JavaScript, tailoring solutions to meet each client’s unique needs for optimal system efficiency.",
    ],
  },
  {
    title: "Digital Manager",
    company_name: "Medical Media",
    icon: medicalMedia,
    iconBg: "#E6DEDD",
    date: "08/2023 – 04/2024",
    points: [
      "Digital manager specializing in the development and implementation of automated landing pages and personalized customer journeys. Extensive experience in digital marketing, leading creative campaigns that drive engagement and enhance user experience. Successfully managed virtual event projects with strong organizational and results-oriented project management skills.",
    ],
  },
  {
    title: "Training & Support",
    company_name: "Medical Media",
    icon: medicalMedia,
    iconBg: "#383E56",
    date: "12/2022 – 08/2023",
    points: [
      "Provided training and support at Medical Media, including onboarding and coaching managers and representatives on the company's systems. Delivered professional technical support to clients, monitored operations, and generated daily and quarterly reports to track company and representative performance, ensuring continuous improvement and goal achievement.",
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
    name: "Learn ToW rite",
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
