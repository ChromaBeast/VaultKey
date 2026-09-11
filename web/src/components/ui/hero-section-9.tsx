import { motion, type Variants } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export interface ActionProps {
  text: string;
  onClick: () => void;
  variant?: ButtonProps['variant'];
  className?: string;
}

export interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  actions: ActionProps[];
  stats: StatProps[];
  images: string[];
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

const floatingVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const HeroSection = ({
  title,
  subtitle,
  actions,
  stats,
  images,
  className,
}: HeroSectionProps) => {
  return (
    <section className={cn('w-full overflow-hidden bg-background py-16 sm:py-24 px-4 sm:px-6 lg:px-8', className)}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-12">
        {/* Left Column: Text Content */}
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          <motion.p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed" variants={itemVariants}>
            {subtitle}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap justify-center gap-3.5 lg:justify-start" variants={itemVariants}>
            {actions.map((action, index) => (
              <Button key={index} onClick={action.onClick} variant={action.variant} size="lg" className={action.className}>
                {action.text}
              </Button>
            ))}
          </motion.div>
          <motion.div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6 lg:justify-start" variants={itemVariants}>
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 bg-card/60 border border-white/10 rounded-xl px-4 py-2.5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/25 shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Image Collage */}
        <motion.div
          className="relative h-[380px] w-full sm:h-[460px] lg:h-[500px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Ambient Glow Orbs */}
          <motion.div
            className="absolute -top-4 left-1/4 h-28 w-28 rounded-full bg-cyan-500/15 blur-2xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-4 right-1/4 h-24 w-24 rounded-full bg-indigo-500/15 blur-2xl"
            variants={floatingVariants}
            animate="animate"
            style={{ transitionDelay: '0.6s' }}
          />
          <motion.div
            className="absolute bottom-1/3 left-6 h-20 w-20 rounded-full bg-purple-500/15 blur-2xl"
            variants={floatingVariants}
            animate="animate"
            style={{ transitionDelay: '1.2s' }}
          />

          {/* Images */}
          <motion.div
            className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-2xl bg-card/80 backdrop-blur-md border border-white/10 p-2 shadow-2xl shadow-black/60 sm:h-64 sm:w-64"
            style={{ transformOrigin: 'bottom center' }}
            variants={imageVariants}
          >
            <img src={images[0]} alt="Hero feature primary" className="h-full w-full rounded-xl object-cover" />
          </motion.div>
          <motion.div
            className="absolute right-2 sm:right-6 top-1/3 h-40 w-40 rounded-2xl bg-card/80 backdrop-blur-md border border-white/10 p-2 shadow-2xl shadow-black/60 sm:h-56 sm:w-56"
            style={{ transformOrigin: 'left center' }}
            variants={imageVariants}
          >
            <img src={images[1]} alt="Hero feature secondary" className="h-full w-full rounded-xl object-cover" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-2 sm:left-6 h-36 w-36 rounded-2xl bg-card/80 backdrop-blur-md border border-white/10 p-2 shadow-2xl shadow-black/60 sm:h-48 sm:w-48"
            style={{ transformOrigin: 'top right' }}
            variants={imageVariants}
          >
            <img src={images[2]} alt="Hero feature tertiary" className="h-full w-full rounded-xl object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
