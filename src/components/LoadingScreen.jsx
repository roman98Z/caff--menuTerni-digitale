import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '/caff--menuTerni-digitale/assets/logo.jpeg';
import '../App.css';

const LoadingScreen = ({ onLoaded }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simula il progresso di caricamento
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onLoaded(), 500); // Ritardo per l'animazione di uscita
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100"
        >
          {/* Logo con animazione */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            className="mb-8"
          >
            <motion.img
              src={logoImage}
              alt="Linc Caffè Zero Logo"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="h-32 w-auto object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>

          {/* Testo del locale */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-amber-800 mb-2">Linc Caffè Zero</h1>
            <p className="text-lg text-amber-600">Terni</p>
            <p className="text-sm text-amber-500 mt-2">Menu Digitale Interattivo</p>
          </motion.div>

          {/* Barra di progresso */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-48 h-2 bg-amber-200 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          {/* Percentuale di caricamento */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-amber-600 text-sm mt-4 font-medium"
          >
            Caricamento... {progress}%
          </motion.p>

          {/* Punti animati */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex space-x-2 mt-6"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-amber-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;

