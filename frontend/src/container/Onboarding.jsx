import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, FaArrowLeft, FaArrowRight, FaCheck, 
  FaLanguage, FaFlag, FaTrophy, FaBook, FaHeart, 
  FaClock, FaGlobe, FaRocket, FaStar, FaChevronRight,
  FaSparkles, FaChartLine
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../style/onboarding_style.css';
// import img from "../assets/logo-img.png"

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    learningLanguage: '',
    englishLevel: '',
    nativeLanguage: '',
    learningGoals: [],
    dailyCommitment: '',
    studyTime: '07:30',
    interests: [],
  });

  // Primary color: Deep Teal (#0D9488)
  const PRIMARY = '#0D9488';

  const languages = [
    { id: 'en', name: 'English', flag: '🇺🇸', emoji: '📚' },
    { id: 'es', name: 'Spanish', flag: '🇪🇸', emoji: '💃' },
    { id: 'fr', name: 'French', flag: '🇫🇷', emoji: '🥐' },
    { id: 'ja', name: 'Japanese', flag: '🇯🇵', emoji: '🎌' },
    { id: 'de', name: 'German', flag: '🇩🇪', emoji: '🍺' },
    { id: 'it', name: 'Italian', flag: '🇮🇹', emoji: '🍕' },
    { id: 'pt', name: 'Portuguese', flag: '🇧🇷', emoji: '⚽' },
    { id: 'zh', name: 'Chinese', flag: '🇨🇳', emoji: '🐼' },
  ];

  const englishLevels = [
    { id: 'beginner', name: 'Beginner', desc: 'Just starting out', icon: '🌱' },
    { id: 'elementary', name: 'Elementary', desc: 'Basic knowledge', icon: '🌿' },
    { id: 'intermediate', name: 'Intermediate', desc: 'Comfortable with basics', icon: '🌳' },
    { id: 'upper', name: 'Upper Intermediate', desc: 'Almost fluent', icon: '🌲' },
    { id: 'advanced', name: 'Advanced', desc: 'Very proficient', icon: '🌴' },
    { id: 'expert', name: 'Expert', desc: 'Near-native', icon: '🌊' },
  ];

  const learningGoals = [
    { id: 'travel', name: 'Travel', desc: 'Speak abroad', icon: <FaFlag /> },
    { id: 'study', name: 'Study', desc: 'Study overseas', icon: <FaBook /> },
    { id: 'career', name: 'Career', desc: 'Advance at work', icon: <FaTrophy /> },
    { id: 'friends', name: 'Friends', desc: 'Connect globally', icon: <FaHeart /> },
    { id: 'movies', name: 'Entertainment', desc: 'Enjoy media', icon: <FaStar /> },
    { id: 'pronunciation', name: 'Pronunciation', desc: 'Speak clearly', icon: <FaLanguage /> },
    { id: 'certificate', name: 'Certificate', desc: 'Get certified', icon: <FaTrophy /> },
    { id: 'fun', name: 'Just for Fun', desc: 'Enjoy learning', icon: <FaHeart /> },
  ];

  const dailyCommitments = [
    { id: '5', name: '5 mins', time: 'Casual' },
    { id: '15', name: '15 mins', time: 'Regular' },
    { id: '30', name: '30 mins', time: 'Serious' },
    { id: '60', name: '1 hr', time: 'Dedicated' },
    { id: 'more', name: '1+ hr', time: 'Intense' },
  ];

  const interests = [
    { id: 'travel', name: 'Travel', emoji: '✈️' },
    { id: 'food', name: 'Food', emoji: '🍕' },
    { id: 'music', name: 'Music', emoji: '🎵' },
    { id: 'tech', name: 'Tech', emoji: '💻' },
    { id: 'sports', name: 'Sports', emoji: '⚽' },
    { id: 'business', name: 'Business', emoji: '💼' },
    { id: 'art', name: 'Art', emoji: '🎨' },
    { id: 'health', name: 'Health', emoji: '💪' },
    { id: 'photography', name: 'Photography', emoji: '📸' },
    { id: 'books', name: 'Books', emoji: '📚' },
    { id: 'movies', name: 'Movies', emoji: '🎬' },
    { id: 'fashion', name: 'Fashion', emoji: '👗' },
    { id: 'nature', name: 'Nature', emoji: '🌿' },
    { id: 'fitness', name: 'Fitness', emoji: '🏃' },
    { id: 'gaming', name: 'Gaming', emoji: '🎮' },
    { id: 'culture', name: 'Culture', emoji: '🏛️' },
    { id: 'science', name: 'Science', emoji: '🔬' },
    { id: 'history', name: 'History', emoji: '📜' },
    { id: 'politics', name: 'Politics', emoji: '🗳️' },
    { id: 'education', name: 'Education', emoji: '🎓' },
  ];

  const steps = [
    {
      title: 'Welcome to VocabLearn',
      subtitle: 'Your journey to fluency starts here',
      content: (
        <div className="h_onboarding_welcome">
          <motion.div 
            className="h_onboarding_welcome_icon"
            animate={{ 
              y: [0, -15, 0], 
              rotate: [0, 3, -3, 0] 
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaGlobe size={100} />
          </motion.div>
          
          <div className="h_onboarding_welcome_text_block">
            <motion.p 
              className="h_onboarding_welcome_text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Join a community of 50 million language learners
            </motion.p>
          </div>

          <div className="h_onboarding_stats">
            {[ 
              { label: 'Languages', value: '35+' },
              { label: 'Lessons', value: '10K+' },
              { label: 'Learners', value: '50M+' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                className="h_onboarding_stat"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1, type: "spring" }}
              >
                <div className="h_onboarding_stat_icon">
                  {idx === 0 ? <FaGlobe /> : idx === 1 ? <FaBook /> : <FaChartLine />}
                </div>
                <div className="h_onboarding_stat_content">
                  <div className="h_onboarding_stat_num">{stat.value}</div>
                  <div className="h_onboarding_stat_label">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'What language?',
      subtitle: 'Pick the language you want to learn',
      content: (
        <div className="h_onboarding_options_grid">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.id}
            //   initial={{ opacity: 0, scale: 0.7, x: index % 2 === 0 ? -30 : 30 }}
            //   animate={{ opacity: 1, scale: 1, x: 0 }}
            //   transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`h_onboarding_option_card ${
                formData.learningLanguage === lang.id
                  ? 'h_onboarding_option_card_selected'
                  : ''
              }`}
              onClick={() =>
                setFormData({ ...formData, learningLanguage: lang.id })
              }
            >
              <div className="h_onboarding_option_emoji">{lang.emoji}</div>
              <span className="h_onboarding_option_flag">{lang.flag}</span>
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
      title: 'Current level',
      subtitle: 'Let us know your starting point',
      content: (
        <div className="h_onboarding_options_list">
          {englishLevels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ x: 8, scale: 1.01 }}
              className={`h_onboarding_option_list_item ${
                formData.englishLevel === level.id
                  ? 'h_onboarding_option_list_item_selected'
                  : ''
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
      title: 'Native language',
      subtitle: 'This helps us personalize lessons',
      content: (
        <div className="h_onboarding_options_grid">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.id}
            //   initial={{ opacity: 0, scale: 0.7, x: index % 2 === 0 ? -30 : 30 }}
            //   animate={{ opacity: 1, scale: 1, x: 0 }}
            //   transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`h_onboarding_option_card ${
                formData.nativeLanguage === lang.id
                  ? 'h_onboarding_option_card_selected'
                  : ''
              }`}
              onClick={() =>
                setFormData({ ...formData, nativeLanguage: lang.id })
              }
            >
              <div className="h_onboarding_option_emoji">{lang.emoji}</div>
              <span className="h_onboarding_option_flag">{lang.flag}</span>
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
      title: 'Why learn?',
      subtitle: 'Select up to 3 goals',
      content: (
        <div className="h_onboarding_options_grid">
          {learningGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, type: "spring" }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className={`h_onboarding_option_card h_onboarding_option_card_with_icon ${
                formData.learningGoals.includes(goal.id)
                  ? 'h_onboarding_option_card_selected'
                  : ''
              }`}
              onClick={() => {
                const isSelected = formData.learningGoals.includes(goal.id);
                let newGoals;
                if (isSelected) {
                  newGoals = formData.learningGoals.filter(
                    (id) => id !== goal.id
                  );
                } else {
                  newGoals = [...formData.learningGoals.slice(0, 2)];
                  newGoals.push(goal.id);
                }
                setFormData({ ...formData, learningGoals: newGoals });
              }}
            >
              <span className="h_onboarding_option_icon">{goal.icon}</span>
              <span className="h_onboarding_goal_name">{goal.name}</span>
              <span className="h_onboarding_goal_desc">{goal.desc}</span>
              {formData.learningGoals.includes(goal.id) && (
                <FaCheck className="h_onboarding_option_check" />
              )}
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: 'Daily commitment',
      subtitle: 'Choose your study pace',
      content: (
        <div className="h_onboarding_options_grid">
          {dailyCommitments.map((commitment, index) => (
            <motion.div
              key={commitment.id}
            //   initial={{ opacity: 0, scale: 0.6 }}
            //   animate={{ opacity: 1, scale: 1 }}
            //   transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.08, rotate: 1 }}
              whileTap={{ scale: 0.93 }}
              className={`h_onboarding_option_card h_onboarding_option_card_with_icon ${
                formData.dailyCommitment === commitment.id
                  ? 'h_onboarding_option_card_selected'
                  : ''
              }`}
              onClick={() =>
                setFormData({ ...formData, dailyCommitment: commitment.id })
              }
            >
              <div className="h_onboarding_time_badge">
                {commitment.time}
              </div>
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
      title: 'Study time',
      subtitle: 'When do you want to practice?',
      content: (
        <div className="h_onboarding_time_picker">
          <div className="h_onboarding_clock">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                transition: { duration: 120, repeat: Infinity, ease: "linear" }
              }}
            >
              <FaClock size={90} className="h_onboarding_clock_icon" />
            </motion.div>
            <input
              type="time"
              value={formData.studyTime}
              onChange={(e) =>
                setFormData({ ...formData, studyTime: e.target.value })
              }
              className="h_onboarding_time_input"
            />
            <motion.div 
              className="h_onboarding_time_display"
              key={formData.studyTime}
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {formData.studyTime}
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: 'Your interests',
      subtitle: 'Select topics you love (up to 5)',
      content: (
        <div className="h_onboarding_interests">
          {interests.map((interest, index) => (
            <motion.div
              key={interest.id}
            //   initial={{ opacity: 0, scale: 0, rotate: -20 }}
            //   animate={{ opacity: 1, scale: 1, rotate: 0 }}
            //   transition={{ delay: index * 0.04, type: "spring", stiffness: 250 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className={`h_onboarding_interest_tag ${
                formData.interests.includes(interest.id)
                  ? 'h_onboarding_interest_tag_selected'
                  : ''
              }`}
              onClick={() => {
                const isSelected = formData.interests.includes(interest.id);
                let newInterests;
                if (isSelected) {
                  newInterests = formData.interests.filter(
                    (id) => id !== interest.id
                  );
                } else {
                  newInterests = [...formData.interests.slice(0, 4)];
                  newInterests.push(interest.id);
                }
                setFormData({ ...formData, interests: newInterests });
              }}
            >
              <span className="h_onboarding_interest_emoji">{interest.emoji}</span>
              {interest.name}
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: 'Almost there...',
      subtitle: 'Personalizing your learning path',
      content: (
        <div className="h_onboarding_progress">
          <div className="h_onboarding_progress_orb">
            <div className="h_onboarding_progress_loader"></div>
            <motion.div
              className="h_onboarding_progress_inner"
              animate={{ 
                scale: [1, 1.08, 1],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* <FaSparkles size={45} /> */}
            </motion.div>
          </div>
          <div className="h_onboarding_progress_messages">
            <motion.p 
              className="h_onboarding_progress_text"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Creating your personalized path
            </motion.p>
          </div>
        </div>
      ),
    },
    {
      title: 'You\'re ready! 🎉',
      subtitle: 'Let\'s start your learning journey',
      content: (
        <div className="h_onboarding_success">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6, duration: 0.7 }}
          >
            <FaCheckCircle size={130} className="h_onboarding_success_icon" />
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
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="h_onboarding_main_page">
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">
            <motion.div 
              className="h_onboarding_container"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.25 }}
            >
              {/* Progress Bar */}
              <div className="h_onboarding_progress_bar">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h_onboarding_progress_step ${
                      index === currentStep
                        ? 'h_onboarding_progress_step_active'
                        : index < currentStep
                        ? 'h_onboarding_progress_step_completed'
                        : ''
                    }`}
                    style={{ width: `${100 / steps.length}%` }}
                    transition={{ duration: 0.35 }}
                  />
                ))}
              </div>

              <div className="h_onboarding_content">
                {/* Header with Back Button */}
                <div className="h_onboarding_header">
                  {!isFirstStep && (
                    <motion.button
                      className="h_onboarding_back_button"
                      onClick={handleBack}
                      whileHover={{ scale: 1.15, x: -3 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <FaArrowLeft />
                    </motion.button>
                  )}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    className="h_onboarding_step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -80 }}
                    transition={{ type: "spring", bounce: 0.22 }}
                  >
                    <div className="h_onboarding_title_container">
                      
                      <motion.h2 
                        className="h_onboarding_title"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                      >
                        {steps[currentStep].title}
                      </motion.h2>

                      {/* Only show image on the first step (Welcome step) */}
                      {currentStep === 0 && (
                        <motion.img 
                          className="h_onboarding_title_image"
                        //   src={require('')} // Replace with your image filename
                          alt="VocabLearn Logo"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.08 }}
                        />
                      )}
                    </div>
                    <motion.p 
                      className="h_onboarding_subtitle"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 }}
                    >
                      {steps[currentStep].subtitle}
                    </motion.p>

                    <div className="h_onboarding_step_content">
                      {steps[currentStep].content}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Footer with Next Button */}
                <div className="h_onboarding_footer">
                  {!isLastStep ? (
                    <motion.button
                      className="h_onboarding_next_button"
                      onClick={handleNext}
                      disabled={
                        (currentStep === 1 && !formData.learningLanguage) ||
                        (currentStep === 2 && !formData.englishLevel) ||
                        (currentStep === 3 && !formData.nativeLanguage) ||
                        (currentStep === 4 && formData.learningGoals.length === 0) ||
                        (currentStep === 5 && !formData.dailyCommitment)
                      }
                      whileHover={!((currentStep === 1 && !formData.learningLanguage) ||
                        (currentStep === 2 && !formData.englishLevel) ||
                        (currentStep === 3 && !formData.nativeLanguage) ||
                        (currentStep === 4 && formData.learningGoals.length === 0) ||
                        (currentStep === 5 && !formData.dailyCommitment)) ? { 
                          scale: 1.06, 
                          y: -4,
                          boxShadow: "0 12px 30px rgba(13, 148, 136, 0.5)" 
                        } : {}}
                      whileTap={!((currentStep === 1 && !formData.learningLanguage) ||
                        (currentStep === 2 && !formData.englishLevel) ||
                        (currentStep === 3 && !formData.nativeLanguage) ||
                        (currentStep === 4 && formData.learningGoals.length === 0) ||
                        (currentStep === 5 && !formData.dailyCommitment)) ? { scale: 0.95 } : {}}
                    >
                      {currentStep === steps.length - 2 ? "Let's go!" : "Continue"}
                      <FaChevronRight className="ms-2" />
                    </motion.button>
                  ) : (
                    <motion.button
                      className="h_onboarding_complete_button"
                      onClick={handleComplete}
                      whileHover={{ scale: 1.06, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaRocket className="me-2" />
                      Start Learning
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
