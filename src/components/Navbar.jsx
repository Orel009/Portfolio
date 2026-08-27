import { useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks, personalInfo } from "../constants";
import { logo, menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  const closeMenu = () => setToggle(false);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            closeMenu();
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="" className="w-9 h-9 object-contain" />
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
            {personalInfo.firstName} &nbsp;
            <span className="sm:block hidden">
              {" "}
              | {personalInfo.lastName}
            </span>
          </p>
        </Link>
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`${
                active === link.title ? "text-white" : "text-secondary"
              } hover:text-white text-[18px] font-medium`}
            >
              <a
                href={`#${link.id}`}
                onClick={() => setActive(link.title)}
                className="block py-2"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            type="button"
            aria-label={toggle ? "Close menu" : "Open menu"}
            aria-expanded={toggle}
            onClick={() => setToggle(!toggle)}
            className="flex items-center justify-center w-11 h-11 -mr-2"
          >
            <img
              src={toggle ? close : menu}
              alt=""
              className="w-[28px] h-[28px] object-contain"
            />
          </button>
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-4 min-w-[160px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-2 w-full">
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  className={`${
                    active === link.title ? "text-white" : "text-secondary"
                  } font-poppins font-medium text-[16px] w-full`}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => {
                      setActive(link.title);
                      closeMenu();
                    }}
                    className="block py-3"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
