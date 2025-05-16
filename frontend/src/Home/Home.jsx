import React, { useState } from "react";
import "./../index.css";
import "./Home.css";
// import lines from "./../assets/lines.svg";
// import "./Lines";
import linesSvg from "../assets/lines.svg";
import logo1 from "./../assets/logos/logo1.svg";
import logo2 from "./../assets/logos/logo2.svg";
import logo3 from "./../assets/logos/logo3.svg";
import logo4 from "./../assets/logos/logo4.svg";
import logo5 from "./../assets/logos/logo5.svg";
import logo6 from "./../assets/logos/logo6.svg";
import logo7 from "./../assets/logos/logo7.svg";
import logo8 from "./../assets/logos/logo8.svg";
import logo9 from "./../assets/logos/logo9.svg";
import logo10 from "./../assets/logos/logo10.svg";
import logo11 from "./../assets/logos/logo11.svg";
import logo12 from "./../assets/logos/logo12.svg";
import arrow from "./../assets/arrow.svg";
import { signIn } from "../services/auth";
import { Link } from "react-router";
import Lines from "./Lines";
import Logo from "../components/Logo";

const HomePage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const faqData = [
    {
      question: "How does the resume analysis work?",
      answer:
        "Our platform lets you upload your resume and a target job description. It then checks the resume based on industry standard \
        ensures your resume is ATS-friendly, and offers tailored suggestions to match the position's requirements.\
        You'll receive clear, actionable feedback on how to reorganize your content, highlight relevant skills, and remove potential red flags.",
    },
    {
      question: "Can this tool help if my first language isn't English?",
      answer:
        "Absolutely! Our audio and text analysis features are designed to help non-native English speakers refine their communication.\
        We identify filler words, grammar issues, and unclear phrasing—then provide tips for improving clarity and tone.\
        This guidance is especially helpful for immigrants who may need extra support navigating Western workplace expectations.",
    },
    {
      question:
        "What's the difference between Speech Analysis and Vocal Analysis?",
      answer:
        "Speech Analysis focuses on what you say: It transcribes your spoken words, flags grammar errors, counts filler words, measures words per minute, and checks overall comprehensibility and structure. <br/><br/>Vocal Analysis looks at how you sound: It evaluates your tone, volume, and pitch so you can adjust for a more confident, engaging delivery.",
    },
    {
      question: "Is my data kept private and secure?",
      answer:
        "Yes. We prioritize user confidentiality. Any resume or audio file you upload is processed securely, and we do not share your information with third parties. All feedback is generated solely to help you improve your employability and is not stored beyond your session unless you choose to save it for personal reference.",
    },
  ];

  const linksData = [
    { name: "Features", route: "#features" },
    { name: "FAQ", route: "#faq" },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen((val) => !val);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  return (
    <>
      {/* <nav className="navbar">
        <div className="navbar-left">
          <span className="logo-name">Acento.ai</span>
        </div>
        <div className="navbar-middle">
          <a href="#" className="nav-link">
            Link A
          </a>
          <a href="#" className="nav-link">
            Another Link
          </a>
          <a href="#" className="nav-link">
            One More
          </a>
          <a href="#" className="nav-link">
            Also This
          </a>
        </div>
        <div className="navbar-right">
          <a href="#" className="nav-link login">
            Login
          </a>
          <Link to={"/auth"}>
            <button type="button"
              className="signup-button"
              onClick={() => {
                console.log("Signing in!");
                signIn("abcd@gmail.com", "password");
              }}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </nav> */}

      <section className="flex items-center justify-between p-6 lg:mx-16 ">
        <Logo />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="black"
          className="size-6 md:hidden"
          onClick={handleToggleDrawer}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <div
          className={`hidden max-md:flex px-8 py-6 max-md:flex-col max-md:fixed max-md:z-2 max-md:inset-0 max-md:left-[15%] max-md:bg-white transition-all ${
            drawerOpen ? "" : "translate-x-[100%]"
          }`}
        >
          <div className="ml-auto mr-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="size-6"
              onClick={handleToggleDrawer}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
          <ul className="my-16">
            {linksData.map((linkItem) => {
              return (
                <li className="mb-2">
                  <a href={linkItem.route}>
                    <p className="text-lg">{linkItem.name}</p>
                  </a>
                </li>
              );
            })}
            <Link to={"/auth"}>
              <button
                type="button"
                className="signup-button mt-8"
                // onClick={() => {
                //   console.log("Signing in!");
                //   signIn("abcd@gmail.com", "password");
                // }}
              >
                <p className="text-white font-bold">Sign Up</p>
              </button>
            </Link>
          </ul>
        </div>
        <div className="max-md:hidden items-center justify-center">
          <ul className="[&>*]:mx-8 inline-flex">
            {linksData.map((linkItem) => {
              return (
                <li className="text-center my-auto">
                  <a href={linkItem.route} className="">
                    <p className="text-lg">{linkItem.name}</p>
                  </a>
                </li>
              );
            })}
            <Link to={"/auth"}>
              <button
                type="button"
                className="signup-button"
                // onClick={() => {
                //   console.log("Signing in!");
                //   signIn("abcd@gmail.com", "password");
                // }}
              >
                <p className="text-white font-bold">Sign Up</p>
              </button>
            </Link>
          </ul>
        </div>
      </section>

      {/* <section>
        <div
          className={`${
            drawerOpen ? "" : "translate-x-[100%]"
          } fixed z-2 bg-white inset-[0% 0% 15% 0]
          transition ease-in-out duration-300`}
        >
          <div className="w-screen py-6 flex items-center justify-between px-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="size-6"
              onClick={handleToggleDrawer}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
          {linksData.map((linkItem) => {
            return (
              <a onClick={() => (window.location.href = "#features")}>
                <p>{linkItem.name}</p>
              </a>
            );
          })}
        </div>
      </section> */}

      {/* <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Articulate Your Voice. <br></br>Empower Your Future.
          </h1>
          <p className="hero-description">
            Enhance your speech, polish your resume, and conquer your next
            interview with Acento.ai
          </p>
          <div className="hero-buttons">
            <button type="button" className="signup-button">Sign Up</button>
            <button type="button"
              onClick={() => (window.location.href = "#features")}
              className="features-button"
            >
              Features
            </button>
          </div>
          <img src={lines} alt="Lines" className="lines-svg" />
        </div>
      </section> */}

      <section className="flex flex-col items-center mx-8 mt-4 md:mt-6 overflow-hidden relative xl:hidden">
        <h1 className="text-[2.5rem]/[2.75rem] text-center font-semibold md:text-6xl">
          <span className="text-[#070036]">Articulate your voice.</span>
          <span className="text-[#5d5c61]"> Empower your future.</span>
        </h1>
        <p className="text-center mt-6 text-lg md:text-2xl">
          Enhance your speech, polish your resume, and conquer your next
          interview with Acento.ai.
        </p>
        <img
          src={linesSvg}
          className="opacity-40 -mx-8 my-10 animate-oscillate"
        />
        <div className="">
          <Link to={"/auth"}>
            <button
              type="button"
              className="bg-[#bcaeec] color-white px-6 py-3 rounded-full mr-8"
            >
              Sign Up
            </button>
          </Link>
          <button
            type="button"
            onClick={() => (window.location.href = "#features")}
          >
            Features
          </button>
        </div>
      </section>

      <section className="lg:grid-cols-2 hidden xl:grid mt-8 py-16">
        <div className="flex flex-col gap-4 p-6 md:p-16 justify-start items-center">
          <h1 className="text-6xl xl:text-7xl leading-none text-center font-semibold">
            <span className="text-[#070036]">Articulate your voice.</span>
            <span className="text-[#5d5c61]"> Empower your future.</span>
          </h1>
          <p className="text-center mt-6 text-lg">
            Enhance your speech, polish your resume, and conquer your next
            interview with Acento.ai.
          </p>
          <div className="mt-16">
            <Link to={"/auth"}>
              <button
                type="button"
                className="bg-[#bcaeec] color-white px-6 py-3 rounded-full mr-8"
              >
                Sign Up
              </button>
            </Link>
            <button
              type="button"
              onClick={() => (window.location.href = "#features")}
            >
              Features
            </button>
          </div>
        </div>
        <img
          src={linesSvg}
          className="w-full h-full max-w-[60%] max-h-[60%] m-auto opacity-40 animate-oscillate"
        />
      </section>

      <section className="mx-8 mt-12 lg:max-w-[60rem] lg:mx-auto">
        <div className="bg-gray-400 w-full aspect-video rounded-2xl" />
      </section>

      <section id="features" className="flex flex-col mx-8 my-20 lg:mx-16">
        <div className="text-4xl font-medium font-heading text-[#5d5c61] mb-8 lg:text-right lg:text-5xl xl:text-6xl lg:font-semibold lg:max-w-[48rem] lg:ml-auto">
          <span className="text-[#070036]">Speak with clarity.</span>
          <span>
            {" "}
            Let our AI refine your voice and elevate your confidence.
          </span>
        </div>

        <div className=" flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:my-4">
          {[
            {
              title: "Speech Analysis",
              description:
                "Assess your interview performance by examining transcription accuracy, filler word frequency, words-per-minute, grammar, and content structure to ensure clear communication.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              ),
            },
            {
              title: "Vocal Analysis",
              description:
                "Evaluate tone, pitch, and volume to help you deliver a confident and engaging verbal presence during interviews and presentations.",
              icon: (
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              ),
            },
            {
              title: "Resume Analysis",
              description:
                "Compare your resume against job descriptions for ATS compatibility and cultural appropriateness, offering tailored feedback to maximize relevance and impact.",
              icon: (
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              ),
            },
          ].map((card, index) => {
            return (
              <div key={index} className="bg-white py-12 px-8 rounded-4xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-16 lg:size-20 xl:size-24"
                >
                  {card.icon}
                </svg>
                <h1 className="text-4xl mt-8 lg:text-5xl lg:mt-16 xl:mt-32 xl:text-6xl">
                  {card.title}
                </h1>
                <p className="text-[#666] mt-4 lg:text-lg xl:text-xl">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* <section className="features-section">
        <div className="section-description">
          <span className="highlighted">Speak with clarity.</span>
          <span>
            {" "}
            Let our AI refine your voice and elevate your confidence.
          </span>
        </div>

        <div id="features" className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3 className="feature-title">Speech Analysis</h3>
            <p className="feature-text">
              Assess your interview performance by examining transcription
              accuracy, filler word frequency, words-per-minute, grammar, and
              content structure to ensure clear communication.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3 className="feature-title">Vocal Analysis</h3>
            <p className="feature-text">
              Evaluate tone, pitch, and volume to help you deliver a confident
              and engaging verbal presence during interviews and presentations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3 className="feature-title">Resume Analysis</h3>
            <p className="feature-text">
              Compare your resume against job descriptions for ATS compatibility
              and cultural appropriateness, offering tailored feedback to
              maximize relevance and impact.
            </p>
          </div>
        </div>
      </section> */}

      <section id="faq" className="mx-8 my-20 gap-12 lg:mx-16 lg:flex">
        <div className="mb-12">
          <h2 className="text-4xl font-medium text-[#070036] mb-4 md:text-5xl lg:text-6xl lg:font-semibold">
            Popular Questions
          </h2>
          <p className="text-[#666] md:text-xl lg:text-2">
            Not seeing your question here? Check out our Help Center for more
            detailed articles, or reach out to our support team at
            support@yourdomain.com. We're here to help you get the most out of
            our platform!
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqData.map((item, index) => (
            <div className="rounded-2xl border-2 p-4" key={index}>
              <div
                className="flex justify-between items-center cursor-pointer color-[#070036] text-xl"
                onClick={() => toggleAccordion(index)}
              >
                <span className="max-w-[90%] md:text-xl xl:text-2xl">
                  {item.question}
                </span>
                <span
                  className={`transition ${
                    openIndex === index ? "-rotate-180" : ""
                  }`}
                >
                  <img src={arrow} alt="Arrow" className="size-4" />
                </span>
              </div>
              <div
                className={`text-[#555] max-h-0 overflow-hidden transition-all duration-300 ease-linear ${
                  openIndex === index ? " max-h-72 mt-4" : ""
                }`}
              >
                {item.answer.split("<br/>").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="flex flex-col items-center text-center mx-8 my-8 mb-8 px-4 py-8 lg:max-w-[60rem] lg:mx-auto rounded-4xl bg-center bg-cover
      bg-[url(/src/assets/cta-image.webp)]"
      >
        <h3 className="text-4xl font-medium ">Empower Your Career. </h3>
        <p className="text-[#5d5c61] mt-4 mb-8 px-2 text-xl">
          Refine your resume, master interview skills, and navigate cultural
          norms—our AI-driven platform guides you ever
        </p>
        <button
          type="button"
          className="bg-[#bcaeec] color-white px-6 py-3 rounded-full mt-16 md:mt-20 lg:mt-32 xl:mt-48"
        >
          Sign Up
        </button>
      </section>

      {/* <section className="cta-section">
        <div className="cta">
          <h3 className="cta-title">Empower Your Career. </h3>
          <p className="cta-subtitle">
            Refine your resume, master interview skills, and navigate cultural
            norms—our AI-driven platform guides you ever
          </p>
          <div className="hero-buttons">
            <button type="button" className="signup-button">Sign Up</button>
            <button type="button" className="features-button">Features</button>
          </div>
        </div>
      </section> */}

      <section className="w-screen py-6 lg:px-16 flex items-center justify-center lg:justify-between">
        <span className="text-[#666] text-sm lg:text-lg">
          © 2025 Acento.ai. All rights reserved.
        </span>
        <div className="hidden lg:flex">
          <ul className="[&>*]:mx-8 inline-flex">
            {linksData.map((linkItem) => {
              return (
                <li className="text-center my-auto">
                  <a href={linkItem.route} className="">
                    <p className="text-lg">{linkItem.name}</p>
                  </a>
                </li>
              );
            })}
            <Link to={"/auth"}>
              <button
                type="button"
                className="signup-button"
                // onClick={() => {
                //   console.log("Signing in!");
                //   signIn("abcd@gmail.com", "password");
                // }}
              >
                <p className="text-white font-bold">Sign Up</p>
              </button>
            </Link>
          </ul>
        </div>
      </section>

      {/* <section className="footer">
        <div className="footer-left">
          © 2025 Acento.ai . All rights reserved.
        </div>
        <div className="footer-right">
          <a href="#" className="footer-link">
            Link A
          </a>
          <a href="#" className="footer-link">
            Another Link
          </a>
          <a href="#" className="footer-link">
            One More
          </a>
          <a href="#" className="footer-link">
            Also This
          </a>
        </div>
      </section> */}
    </>
  );
};

export default HomePage;
