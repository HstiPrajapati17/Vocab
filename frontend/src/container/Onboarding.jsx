import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle, FaArrowLeft, 
  FaCheck,
  FaFlag,
  FaBook,
  FaTrophy,
  FaHeart,
  FaRocket,
  FaLanguage,
  FaGlobe,
  FaMicrophone,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../style/onboarding_style.css";

import bird_img from "../assets/logo-bird.png";
import us_flag from "../assets/USFlag.webp";
import germany_flag from "../assets/GermanyFlag.jpg";
import france_flag from "../assets/FranceFlag.png";
import poland_flag from "../assets/PolandFlag.png";
import ohter_img from "../assets/more.jpg";

import { BsArrowRightCircleFill } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import { title } from "framer-motion/client";
import { FaSpinner, FaCrown, FaStar, FaGem } from "react-icons/fa";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    learningLanguage: "",
    englishLevel: "",
    learningGoal: "",
    dailyCommitment: "",
    nativeLanguage: "",
    yourinterest: [],
  });

  const languages = [
    { id: "en", name: "English", flag: us_flag },
    { id: "de", name: "German", flag: germany_flag },
    { id: "fr", name: "French", flag: france_flag },
    { id: "ps", name: "Polish", flag: poland_flag },
  ];

  const Nativelanguages = [
    { id: "en", name: "English", flag: us_flag },
    { id: "de", name: "German", flag: germany_flag },
    { id: "fr", name: "French", flag: france_flag },
    { id: "ps", name: "Polish", flag: poland_flag },
    { id: "ot", name: "Other", flag: ohter_img },
  ];

  const englishLevels = [
    { id: "beginner", name: "Beginner", desc: "Just starting out", icon: "🌱" },
    {
      id: "intermediate",
      name: "Intermediate",
      desc: "Comfortable with basics",
      icon: "🌳",
    },
    { id: "advanced", name: "Advanced", desc: "Very proficient", icon: "🌴" },
  ];

  const learningGoals = [
    { id: "study", name: "Prepare for studying abroad", icon: <FaFlag /> },
    { id: "connect", name: "Connect with people", icon: <FaBook /> },
    { id: "career", name: "Advance in my career", icon: <FaTrophy /> },
    { id: "fun", name: "Just for Fun", icon: <FaHeart /> },
    {
      id: "skill",
      name: "Improve my pronunciation skill",
      icon: <FaMicrophone />,
    },
    { id: "other", name: "Other", icon: <HiDotsHorizontal /> },
  ];

  const yourInterests = [
    { id: "travel", name: "Travel" },
    { id: "food", name: "Food" },
    { id: "music", name: "Music" },
    { id: "sports", name: "Sports" },
    { id: "business", name: "Business" },
    { id: "art", name: "Art" },
    { id: "health", name: "Health" },
    { id: "photography", name: "Photography" },
    { id: "books", name: "Books" },
    { id: "movies", name: "Movies" },
    { id: "fashion", name: "Fashion" },
    { id: "nature", name: "Nature" },
    { id: "fitness", name: "Fitness" },
    { id: "gaming", name: "Gaming" },
    { id: "culture", name: "Culture" },
    { id: "science", name: "Science" },
    { id: "history", name: "History" },
    { id: "politics", name: "Politics" },
    { id: "education", name: "Education" },
  ];

  const dailyCommitments = [
    { id: "5", name: "5 mins", badge: "Casual" },
    { id: "15", name: "15 mins", badge: "Regular" },
    { id: "30", name: "30 mins", badge: "Serious" },
    { id: "60", name: "1 hr", badge: "Dedicated" },
  ];

  const steps = [
    {
      title: null,
      subtitle: "Your journey to fluency starts here",
      content: (
        <>
          {/* Login link at top right */}
          <div className="h_onboarding_login_link_container">
            <a href="/auth" className="h_onboarding_login_link">
              Already have an account? Login
            </a>
          </div>

          {/* Main welcome section */}
          <div className="h_onboarding_welcome">
            {/* Welcome title with image */}
            <div className="h_onboarding_welcome_title_container">
              <motion.span
                className="h_onboarding_welcome_text_prefix"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Welcome to
              </motion.span>

              <motion.h2
                className="h_onboarding_welcome_title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.img
                  className="h_onboarding_title_image"
                  src={bird_img}
                  alt="VocabLearn Logo"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                />
                VocabLearn
              </motion.h2>
            </div>
            <p className="h_onboarding_subtitle">
              Your journey to fluency starts here
            </p>

            <div className="h_onboarding_welcome_text_block">
              <motion.p
                className="h_onboarding_welcome_text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Say hello to a new language—your way!
              </motion.p>
            </div>
            <div className="h_onboarding_stats">
              {[
                { label: "Languages", value: "35+" },
                { label: "Lessons", value: "10K+" },
                { label: "Learners", value: "50M+" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="h_onboarding_stat"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1, type: "spring" }}
                >
                  <div className="h_onboarding_stat_icon">
                    {idx === 0 ? (
                      <FaGlobe />
                    ) : idx === 1 ? (
                      <FaBook />
                    ) : (
                      <FaLanguage />
                    )}
                  </div>
                  <div className="h_onboarding_stat_content">
                    <div className="h_onboarding_stat_num">{stat.value}</div>
                    <div className="h_onboarding_stat_label">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Language to Learn... ?",
      subtitle: "Pick the language you want to learn",
      content: (
        <div className="h_onboarding_options_grid">
          {languages.map((lang) => (
            <motion.div
              key={lang.id}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`h_onboarding_option_card ${
                formData.learningLanguage === lang.id
                  ? "h_onboarding_option_card_selected"
                  : ""
              }`}
              onClick={() =>
                setFormData({ ...formData, learningLanguage: lang.id })
              }
            >
              <span className="h_onboarding_option_flag">
                <img
                  src={lang.flag}
                  className="h_onboarding_option_flag_img"
                  alt={`${lang.name} flag`}
                />
              </span>
              <span className="h_onboarding_option_name">{lang.name}</span>
              {formData.learningLanguage === lang.id && (
                <FaCheck className="h_onboarding_option_check" />
              )}
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Current level",
      subtitle: "Let us know your starting point",
      content: (
        <div className="h_onboarding_options_list">
          {englishLevels.map((level) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ x: 6, scale: 1.01 }}
              className={`h_onboarding_option_list_item ${
                formData.englishLevel === level.id
                  ? "h_onboarding_option_list_item_selected"
                  : ""
              }`}
              onClick={() =>
                setFormData({ ...formData, englishLevel: level.id })
              }
            >
              <div className="h_onboarding_option_list_content">
                <span className="h_onboarding_level_icon">{level.icon}</span>
                <div>
                  <div className="h_onboarding_level_name">{level.name}</div>
                  <div className="h_onboarding_level_desc">{level.desc}</div>
                </div>
              </div>
              {formData.englishLevel === level.id && (
                <FaCheck className="h_onboarding_option_list_check" />
              )}
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Your native language",
      subtitle: "Select your native language",
      content: (
        <div className="h_onboarding_options_grid">
          {Nativelanguages.map((lang) => (
            <motion.div
              key={lang.id}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`h_onboarding_option_card ${
                formData.nativeLanguage === lang.id
                  ? "h_onboarding_option_card_selected"
                  : ""
              }`}
              onClick={() =>
                setFormData({ ...formData, nativeLanguage: lang.id })
              }
            >
              <span className="h_onboarding_option_flag">
                <img
                  src={lang.flag}
                  className="h_onboarding_option_flag_img"
                  alt={`${lang.name} flag`}
                />
              </span>
              <span className="h_onboarding_option_name">{lang.name}</span>
              {formData.nativeLanguage === lang.id && (
                <FaCheck className="h_onboarding_option_check" />
              )}
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Your learning goals?",
      subtitle: "What is your main goal?",
      content: (
        <div className="h_onboarding_options_grid">
          {learningGoals.map((goal) => (
            <motion.div
              key={goal.id}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`h_onboarding_option_card h_onboarding_option_card_with_icon ${
                formData.learningGoal === goal.id
                  ? "h_onboarding_option_card_selected"
                  : ""
              }`}
              onClick={() =>
                setFormData({ ...formData, learningGoal: goal.id })
              }
            >
              <span className="h_onboarding_option_icon">{goal.icon}</span>
              <span className="h_onboarding_goal_name">{goal.name}</span>
              <span className="h_onboarding_goal_desc">{goal.desc}</span>
              {formData.learningGoal === goal.id && (
                <FaCheck className="h_onboarding_option_check" />
              )}
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Your Interest ?",
      subtitle: "Select up to 5 topics",
      content: (
        <div className="h_onboarding_interest_grid">
          {yourInterests.map((interest) => (
            <motion.div
              key={interest.id}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`h_onboarding_option_card ${
                formData.yourinterest.includes(interest.id)
                  ? "h_onboarding_option_card_selected"
                  : ""
              }`}
              onClick={() => {
                const selectedInterests = [...formData.yourinterest];

                if (selectedInterests.includes(interest.id)) {
                  // Deselect interest
                  const index = selectedInterests.indexOf(interest.id);
                  selectedInterests.splice(index, 1);
                } else {
                  // Add interest (no limit here)
                  selectedInterests.push(interest.id);
                }

                setFormData({ ...formData, yourinterest: selectedInterests });
              }}
            >
              <div className="h_onboarding_option_time">{interest.name}</div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Daily time commitment?",
      subtitle: "Choose your study pace",
      content: (
        <div className="h_onboarding_options_grid">
          {dailyCommitments.map((commitment) => (
            <motion.div
              key={commitment.id}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`h_onboarding_option_card h_onboarding_option_card_with_icon ${
                formData.dailyCommitment === commitment.id
                  ? "h_onboarding_option_card_selected"
                  : ""
              }`}
              onClick={() =>
                setFormData({ ...formData, dailyCommitment: commitment.id })
              }
            >
              <div className="h_onboarding_time_badge">{commitment.badge}</div>
              <span className="h_onboarding_option_time">
                {commitment.name}
              </span>
              {formData.dailyCommitment === commitment.id && (
                <FaCheck className="h_onboarding_option_check" />
              )}
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "You're ready! 🎉",
      subtitle: "Let's start your learning journey",
      content: (
        <div className="h_onboarding_success">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6, duration: 0.7 }}
          >
            <FaCheckCircle size={84} className="h_onboarding_success_icon" />
          </motion.div>
          <motion.p
            className="h_onboarding_success_text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your personalized plan is ready!
          </motion.p>
        </div>
      ),
    },
    {
      title: null,
      subtitle: null,
      content: (
        <div className="h_onboarding_loading">
          <motion.div
            className="h_onboarding_loading_spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner size={80} />
          </motion.div>
          <motion.p
            className="h_onboarding_loading_text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Preparing your experience...
          </motion.p>
        </div>
      ),
    },
    {
      title: "Unlock Your Pro Experience",
      subtitle: "Get unlimited access to premium features",
      content: (
        <div className="h_onboarding_subscription">
          <motion.div
            className="h_onboarding_subscription_header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h_onboarding_subscription_icon">
              <FaCrown size={60} />
            </div>
            <h3 className="h_onboarding_subscription_title">
              Congrats, You Just Unlocked Everything!
            </h3>
            <p className="h_onboarding_subscription_subtitle">
              Welcome Home Premium
            </p>
          </motion.div>
          
          <div className="h_onboarding_subscription_features">
            {[
              { icon: <FaStar />, text: "Unlimited lessons" },
              { icon: <FaGem />, text: "Premium content" },
              { icon: <FaCrown />, text: "Ad-free experience" },
              { icon: <FaStar />, text: "Offline access" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="h_onboarding_subscription_feature"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <span className="h_onboarding_subscription_feature_icon">
                  {feature.icon}
                </span>
                <span className="h_onboarding_subscription_feature_text">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="h_onboarding_subscription_cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="h_onboarding_subscription_cta_text">
              Start your free trial today!
            </p>
          </motion.div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding complete!', formData);
    navigate('/auth');
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const isStepValid = () => {
    if (currentStep === 1 && !formData.learningLanguage) return false;
    if (currentStep === 2 && !formData.englishLevel) return false;
    if (currentStep === 3 && !formData.nativeLanguage) return false;
    if (currentStep === 4 && !formData.learningGoal) return false;
    if (currentStep === 5 && !formData.yourinterest) return false;
    if (currentStep === 6 && !formData.dailyCommitment) return false;
    // Loading step (index 8) and subscription step (index 9) are always valid
    return true;
  };

  // Auto-progress from loading step to subscription step
  useEffect(() => {
    if (currentStep === 8) {
      const timer = setTimeout(() => {
        setCurrentStep(9);
      }, 2000); // 2 seconds loading
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="h_onboarding_main_page">
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7 p-0">
            <motion.div
              className="h_onboarding_container"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.2 }}
            >
              {/* Progress Bar */}
              <div className="h_onboarding_progress_bar">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h_onboarding_progress_step ${
                      index === currentStep
                        ? "h_onboarding_progress_step_active"
                        : index < currentStep
                          ? "h_onboarding_progress_step_completed"
                          : ""
                    }`}
                    style={{ width: `${100 / steps.length}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                ))}
              </div>

              {/* Main Content */}
              <div className="h_onboarding_content">
                {/* Header with Back Button */}
                <div className="h_onboarding_header">
                  {!isFirstStep && (
                    <motion.button
                      className="h_onboarding_back_button"
                      onClick={handleBack}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaArrowLeft />
                    </motion.button>
                  )}
                </div>

                {/* Step Content with animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    className="h_onboarding_step"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  >
                    {/* Title & Subtitle (only for non-welcome steps) */}
                    {steps[currentStep].title && (
                      <>
                        <div className="h_onboarding_title_container">
                          <motion.h2
                            className="h_onboarding_title"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            {steps[currentStep].title}
                          </motion.h2>
                        </div>
                        <motion.p
                          className="h_onboarding_subtitle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {steps[currentStep].subtitle}
                        </motion.p>
                      </>
                    )}

                    {/* Step-specific content */}
                    <div className="h_onboarding_step_content">
                      {steps[currentStep].content}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Footer Navigation Buttons */}
                <div className="h_onboarding_footer">
                  {!isLastStep ? (
                    <motion.button
                      className="h_onboarding_next_button"
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      whileHover={isStepValid() ? { scale: 1.05 } : {}}
                      whileTap={isStepValid() ? { scale: 0.97 } : {}}
                    >
                      {currentStep === steps.length - 2
                        ? "Let's go!"
                        : "Continue"}
                      <BsArrowRightCircleFill
                        size={24}
                        style={{ marginLeft: "8px" }}
                      />
                    </motion.button>
                  ) : (
                    <motion.button
                      className="h_onboarding_complete_button"
                      onClick={handleComplete}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Start Learning
                      <FaRocket size={16} style={{ marginLeft: "8px" }} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
