"use client";

import { motion } from "framer-motion";
import { Pacifico } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function AboutUsHero({
  badge,
  title1,
  title2,
  description,
}: {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative h-180 w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/beautiful-natural-scenery.jpg?height=1080&width=1920"
          alt="Mountains landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/5" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.15] via-transparent to-purple-500/[0.15] z-[1] blur-xs" />

      <div className="absolute inset-0 overflow-hidden z-[2]">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-teal-500/70"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-amber-500/70"
          className="right-[-5%] md:right-[-1%] top-[70%] md:top-[45%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-green-500/70"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.9] border border-white/[0.15] mb-8 md:mb-12"
          >
            <span className="text-sm text-black/90 tracking-wide">{badge}</span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 ">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {title1}
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-400 to-amber-300",
                  pacifico.className
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white mb-8 leading-relaxed font-semibold tracking-wide max-w-2xl mx-auto px-4">
              {description}
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <button className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white font-medium hover:shadow-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 cursor-pointer">
              Explore more
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
