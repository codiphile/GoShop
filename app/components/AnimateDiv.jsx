"use client";

import { motion } from "framer-motion";

const AnimatedDiv = ({ children, fadeIn }) => {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedDiv;
