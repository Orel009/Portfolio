import { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { personalInfo } from "../constants";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_q3v4rbr",
        "template_j6cdc55",
        {
          from_name: form.name,
          to_name: personalInfo.name,
          from_email: form.email,
          to_email: personalInfo.email,
          message: form.message,
        },
        "Pj59bt66seZ24aeXh"
      )
      .then(
        () => {
          setLoading(false);
          alert("Message sent successfully!");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="flex justify-center">
      <motion.div
        variants={slideIn("up", "tween", 0.2, 1)}
        className="w-full max-w-2xl bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className={styles.sectionHeadText}>Contact.</h2>
          <a
            href={personalInfo.cvUrl}
            download
            className="inline-flex items-center gap-2 border border-secondary text-secondary hover:text-white hover:border-white transition-colors font-medium text-fluid-label px-5 py-3 rounded-xl"
          >
            Download CV
          </a>
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-8"
        >
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Message</span>
            <textarea
              rows="7"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg border-none font-medium"
            />
          </label>
          <button
            className="bg-tertiary py-3 px-8 w-fit text-white font-bold shadow-primary rounded-xl"
            type="submit"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const WrappedContact = SectionWrapper(Contact, "contact");
export default WrappedContact;
