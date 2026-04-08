"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const boxShadow: MotionValue<string> | string =
    "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042";

  return (
    <div
      ref={containerRef}
      className="relative flex h-[60rem] items-center justify-center md:h-[80rem]"
    >
      <div className="mx-auto w-full max-w-6xl" style={{ perspective: "1000px" }}>
        <motion.div style={{ translateY: translate }}>{titleComponent}</motion.div>

        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow,
          }}
          className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-3"
        >
          <div className="overflow-hidden rounded-xl">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};
