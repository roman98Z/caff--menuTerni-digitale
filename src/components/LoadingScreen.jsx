import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logoImage from '../assets/logo.jpeg';
import '../App.css'; // Per stili globali o specifici del loader

const LoadingScreen = ({ onLoaded }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoaded();
    }, 3000); // 3 secondi di animazione

    return () => clearTimeout(timer);
  }, [onLoaded]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.img
        src={logoImage}
        alt="Loading Logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1,
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
        className="h-24 w-auto object-contain"
      />
    </motion.div>
  );
};

export default LoadingScreen;

