import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const animations = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animations}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

AnimatedPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AnimatedPage;
