import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('a, button, input, select, textarea, [role="button"], .interactive');
      if (interactive) {
        setIsPointer(true);
        setCursorVariant("interactive");
      } else {
        setIsPointer(false);
        setCursorVariant("default");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);

  return (
    <>
      {/* Interactive Radial Mouse Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 140, 90, 0.075), transparent 80%)`,
        }}
      />

      {/* Cyber Cursor Core Dot */}
      <motion.div
        className="fixed top-0 left-0 bg-primary rounded-full pointer-events-none z-[9999] shadow-[0_0_12px_rgba(255,140,90,0.8)]"
        style={{ width: 6, height: 6 }}
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 1200, damping: 50 }}
      />

      {/* Specular Circular Outline */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - (isPointer ? 22 : 16),
          y: mousePosition.y - (isPointer ? 22 : 16),
          width: isPointer ? 44 : 32,
          height: isPointer ? 44 : 32,
          borderColor: isPointer ? "rgba(255, 140, 90, 0.8)" : "rgba(255, 255, 255, 0.25)",
          backgroundColor: isPointer ? "rgba(255, 140, 90, 0.08)" : "transparent",
        }}
        style={{
          borderWidth: 1.5,
          borderStyle: "solid",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </>
  );
};

export default Cursor;
