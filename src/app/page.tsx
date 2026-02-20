"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  ChevronDown,
  Brain,
  Database,
  Zap,
  TrendingUp,
  Target,
  CheckCircle2,
  Menu,
  X,
  MessageSquare,
  Shield,
  BarChart3,
  Sparkles,
  Send,
  Quote,
  Star,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

// Responsive animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideInLeft = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideInRight = {
  hidden: { x: 60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Responsive Pattern Background
const PatternBackground = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Animated gradient orbs - Teal & Blue palette matching new logo */}
      <motion.div
        className="absolute -top-20 -left-20 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-96 lg:h-96 blur-[100px]"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, #1E6B8C 0deg, #7DD3D3 120deg, #1E6B8C 240deg, #1E6B8C 360deg)",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute top-1/2 -right-20 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 blur-[100px]"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, #7DD3D3 0deg, #1E6B8C 120deg, #7DD3D3 240deg, #7DD3D3 360deg)",
        }}
        animate={{
          rotate: -360,
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute -bottom-20 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 blur-[80px]"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, #A8E0F0 0deg, #1E6B8C 120deg, #7DD3D3 240deg, #A8E0F0 360deg)",
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// Navigation - Fully Responsive
const Navigation = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/20"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Responsive sizing */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection("hero")}
          >
            <div className="relative">
              <img
                src="/sutbhutech_logo.png"
                alt="Surbhu Tech"
                className="h-12 sm:h-14 lg:h-16 w-12 sm:w-14 lg:w-16 rounded-full object-cover"
              />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
              Surbhu<span className="text-primary">Tech</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 sm:gap-6 lg:gap-8">
            {[
              { id: "about", label: "About", desc: "" },
              { id: "solutions", label: "Solutions", desc: "" },
              { id: "work", label: "Work", desc: "" },
              { id: "contact", label: "Contact", desc: "" },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm sm:text-base font-semibold text-secondary-foreground hover:text-primary transition-colors py-2"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* CTA Button - Hidden on mobile, visible on md */}
          <div className="hidden md:block">
            <Button
              onClick={() => scrollToSection("contact")}
              className="relative overflow-hidden group h-10 sm:h-12 px-6 sm:px-8 text-base font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-full"
            >
              <span className="relative z-10">Start Project</span>
            </Button>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Fixed overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl md:hidden"
        >
          <div className="container mx-auto px-4 py-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end mb-6 flex items-center gap-2 text-secondary-foreground hover:text-primary"
            >
              <X className="h-6 w-6" />
              <span className="text-sm font-semibold">Close</span>
            </button>
            <nav className="flex flex-col gap-4">
              {[
                { id: "about", label: "About" },
                { id: "solutions", label: "Solutions" },
                { id: "work", label: "Work" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-lg sm:text-xl font-semibold text-secondary-foreground hover:text-primary transition-colors py-3"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

// Hero Section - Fully Responsive
const HeroSection = () => {
  const { scrollY } = useScroll();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16 sm:pt-20 lg:pt-24 overflow-hidden"
    >
      <PatternBackground />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="w-full order-2 lg:order-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-4 sm:space-y-6 lg:space-y-8"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="inline-block">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 border border-primary/30 rounded-full text-xs sm:text-sm font-semibold text-primary">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">
                    Next-Gen AI Solutions
                  </span>
                  <span className="block sm:hidden">AI Solutions</span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={slideInLeft}
                className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-tight sm:leading-snug lg:leading-none"
              >
                <span className="block">INNOVATING YOUR</span>
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  DIGITAL FUTURE
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg lg:text-xl text-secondary-foreground max-w-lg sm:max-w-xl lg:max-w-2xl leading-relaxed"
              >
                We architect intelligent systems that think, learn, and evolve.
                Transform your business with autonomous AI agents and
                cutting-edge technology.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
              >
                <Button
                  size="default"
                  className="h-11 sm:h-12 lg:h-14 w-full sm:w-auto px-6 sm:px-8 text-base sm:text-lg font-semibold relative overflow-hidden group bg-gradient-to-r from-primary to-accent text-white rounded-xl"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="h-11 sm:h-12 lg:h-14 w-full sm:w-auto px-6 sm:px-8 text-base sm:text-lg font-semibold"
                  onClick={() =>
                    document
                      .getElementById("work")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  View Our Work
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 pt-4 border-t border-border/20"
              >
                {[
                  { value: "150+", label: "Projects", icon: Target },
                  { value: "98%", label: "Success", icon: Star },
                  { value: "24/7", label: "Support", icon: Shield },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="flex flex-1 flex-col gap-1 sm:gap-2"
                  >
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-secondary-foreground uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Visual - Hidden on mobile */}
          <motion.div
            style={{ y: scrollY }}
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="hidden lg:block relative w-full"
          >
            <div className="relative max-w-lg mx-auto">
              {/* Terminal card */}
              <motion.div
                className="relative p-6 sm:p-8 lg:p-10 card-surface rounded-2xl lg:rounded-3xl shadow-2xl"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-destructive"></div>
                    <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-accent"></div>
                    <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-primary"></div>
                    <span className="text-xs sm:text-sm font-mono text-secondary-foreground">
                      surbhu-ai-console
                    </span>
                  </div>
                </div>

                {/* Code */}
                <div className="space-y-2 sm:space-y-3 font-mono text-sm sm:text-base text-secondary-foreground">
                  <div>$ initiate transformation</div>
                  <div className="text-accent">→ analyzing requirements...</div>
                  <div className="text-primary">
                    → designing AI-architecture...
                  </div>
                  <motion.div
                    className="text-primary"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                  >
                    → deploying intelligent-systems...
                  </motion.div>
                  <div className="text-primary font-bold">
                    ✓ Transformation complete!
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -top-3 -right-3 bg-gradient-to-br from-primary to-accent text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg"
                  animate={{
                    rotate: [-3, 3, -3],
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  LIVE AI
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/3 md:left-1/2 md:hidden flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <span className="text-xs sm:text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
          Scroll to explore
        </span>
        <ChevronDown className="h-4 w-4 text-primary" />
      </motion.div>
    </section>
  );
};

// About Section - Fully Responsive
const AboutSection = () => {
  const milestones = [
    {
      year: "2018",
      title: "Founded",
      description: "Born to innovate digital futures",
      color: "from-primary to-accent",
    },
    {
      year: "2020",
      title: "Expansion",
      description: "Global enterprise solutions",
      color: "from-accent to-primary",
    },
    {
      year: "2022",
      title: "Innovation",
      description: "Pioneered AI frameworks",
      color: "from-accent to-primary",
    },
    {
      year: "2024",
      title: "Leadership",
      description: "150+ successful implementations",
      color: "from-accent to-primary",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Deploy in days, not months",
      color: "text-primary",
    },
    {
      icon: Shield,
      title: "Enterprise Grade",
      description: "Security and compliance built-in",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      title: "Scalable",
      description: "Grows with your business",
      color: "text-primary",
    },
  ];

  return (
    <section
      id="about"
      className="py-16 sm:py-20 lg:py-32 relative overflow-hidden gradient-bg"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4"
          >
            WE DON'T JUST <span className="text-primary">BUILD</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg lg:text-xl text-secondary-foreground max-w-xl sm:max-w-2xl lg:max-w-3xl"
          >
            We architect intelligent systems that think, learn, and evolve.
            Transform your business with autonomous AI agents and cutting-edge
            technology.
          </motion.p>
        </motion.div>

        {/* Milestones - Responsive grid */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 lg:mb-16"
        >
          {milestones.map((milestone, i) => (
            <motion.div
              key={milestone.year}
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="relative p-4 sm:p-6 lg:p-8 card-surface rounded-xl lg:rounded-2xl overflow-hidden transition-all hover:scale-105 hover:-translate-y-1">
                {/* Year badge */}
                <div
                  className={cn(
                    "absolute -top-2 sm:-top-3 left-4 sm:left-6 lg:left-8 bg-gradient-to-r text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-2xl sm:text-3xl font-black shadow-lg",
                    milestone.color,
                  )}
                >
                  {milestone.year}
                </div>

                {/* Content */}
                <div className="pt-6 sm:pt-8 space-y-2 sm:space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary-foreground">
                    {milestone.description}
                  </p>
                </div>

                {/* Hover gradient overlay */}
                <motion.div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r",
                    milestone.color,
                  )}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features - Responsive grid */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="relative p-4 sm:p-6 card-surface rounded-xl lg:rounded-2xl transition-all hover:scale-102 hover:-translate-y-1"
            >
              {/* Icon */}
              <motion.div
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 bg-surface border border-border/30 rounded-xl flex items-center justify-center mb-4 sm:mb-6 transition-all group-hover:scale-110 group-hover:-translate-y-1"
                whileHover={{ rotate: 5 }}
              >
                <feature.icon
                  className={cn("h-6 w-6 sm:h-7 sm:w-8", feature.color)}
                />
              </motion.div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-secondary-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Services Section - Fully Responsive
const ServicesSection = () => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const solutions = [
    {
      icon: Brain,
      title: "Agentic AI",
      description: "Autonomous agents that reason and act independently",
      items: [
        "Multi-Agent Systems",
        "Task Orchestration",
        "Self-Learning",
        "Decision Making",
      ],
      color: "from-primary to-accent",
      bg: "bg-primary/10",
    },
    {
      icon: Database,
      title: "Data Intelligence",
      description: "Transform data into actionable insights",
      items: [
        "Real-time Analytics",
        "ML Pipelines",
        "Data Warehousing",
        "Predictive Models",
      ],
      color: "from-accent to-primary",
      bg: "bg-accent/10",
    },
    {
      icon: Cpu,
      title: "Cloud & DevOps",
      description: "Scalable infrastructure for modern applications",
      items: [
        "Multi-Cloud Strategy",
        "CI/CD Pipelines",
        "Infrastructure as Code",
        "Auto-Scaling",
      ],
      color: "from-primary to-accent",
      bg: "bg-primary/10",
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Protect your digital assets with AI",
      items: [
        "Threat Detection",
        "Zero Trust",
        "Compliance",
        "Incident Response",
      ],
      color: "from-accent to-primary",
      bg: "bg-accent/10",
    },
    {
      icon: MessageSquare,
      title: "AI Assistants",
      description: "Intelligent conversational interfaces",
      items: [
        "Natural Language",
        "24/7 Availability",
        "Multi-Channel",
        "Analytics",
      ],
      color: "from-primary to-accent",
      bg: "bg-primary/10",
    },
    {
      icon: BarChart3,
      title: "Business Intelligence",
      description: "Data-driven strategic insights",
      items: ["Dashboards", "KPI Tracking", "Reports", "Forecasting"],
      color: "from-accent to-primary",
      bg: "bg-accent/10",
    },
  ];

  return (
    <section
      id="solutions"
      className="py-16 sm:py-20 lg:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4"
          >
            SOLUTIONS THAT{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WORK
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg lg:text-xl text-secondary-foreground max-w-xl sm:max-w-2xl lg:max-w-3xl"
          >
            Explore our comprehensive suite of AI-powered solutions
          </motion.p>
        </motion.div>

        {/* Services grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ delay: i * 0.05 }}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={cn(
                  "relative p-5 sm:p-6 lg:p-8 border-2 border-transparent rounded-xl lg:rounded-2xl transition-all duration-300 card-surface",
                  hoveredIndex === i ? "border-primary scale-105" : "scale-100",
                )}
              >
                {/* Header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <motion.div
                    className={cn(
                      "relative p-3 sm:p-4 rounded-xl",
                      solution.bg,
                      "transition-all duration-300",
                      "group-hover:scale-110",
                    )}
                    whileHover={{ rotate: 5 }}
                  >
                    <solution.icon
                      className={cn(
                        "h-6 w-6 sm:h-8",
                        hoveredIndex === i ? "text-white" : "text-primary",
                      )}
                    />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                      {solution.title}
                    </h3>
                    <p className="text-sm sm:text-base text-secondary-foreground">
                      {solution.description}
                    </p>
                  </div>
                </div>

                {/* Expandable list */}
                <motion.ul
                  className="space-y-3"
                  initial={false}
                  animate={{
                    height: hoveredIndex === i ? "auto" : 0,
                    opacity: hoveredIndex === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {solution.items.map((item, j) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: hoveredIndex === i ? 1 : 0,
                        x: 0,
                      }}
                      transition={{ delay: hoveredIndex === i ? j * 0.05 : 0 }}
                      className="flex items-center gap-3 text-sm sm:text-base"
                    >
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Hover gradient overlay */}
                <motion.div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r",
                    solution.color,
                  )}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Work Section - Fully Responsive
const WorkSection = () => {
  const projects = [
    {
      title: "Enterprise AI Platform",
      category: "AI/ML",
      description: "Autonomous decision system for Fortune 500",
      metrics: ["85% faster", "99.2% accuracy", "24/7 operations"],
      color: "from-primary to-accent",
    },
    {
      title: "Predictive Analytics Suite",
      category: "Data Science",
      description: "Real-time insights for retail chain",
      metrics: ["30% revenue boost", "500+ predictions", "2x ROI"],
      color: "from-accent to-primary",
    },
    {
      title: "AI Customer Service",
      category: "Conversational AI",
      description: "Chatbot handling 1M+ monthly queries",
      metrics: ["95% satisfaction", "60% deflection", "Instant response"],
      color: "from-primary to-accent",
    },
  ];

  return (
    <section id="work" className="py-16 sm:py-20 lg:py-32 relative gradient-bg">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4"
          >
            FEATURED{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WORK
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg lg:text-xl text-secondary-foreground max-w-xl sm:max-w-2xl lg:max-w-3xl"
          >
            Real projects with real impact
          </motion.p>
        </motion.div>

        {/* Projects grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative h-full">
                {/* Gradient top border */}
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-2 rounded-t-xl",
                    project.color,
                  )}
                />

                {/* Content */}
                <div className="relative p-5 sm:p-6 lg:p-8 pt-8 card-surface rounded-xl lg:rounded-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-102">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary-foreground mb-3">
                    {project.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-secondary-foreground mb-6 sm:mb-8">
                    {project.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {project.metrics.map((metric, idx) => (
                      <motion.div
                        key={metric}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                        className="relative group"
                      >
                        {/* Animated background glow */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ opacity: 1 }}
                        />

                        {/* Metric value */}
                        <div className="relative">
                          <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {metric}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section - Fully Responsive
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "Surbhu Tech transformed our operations completely. The autonomous agents handle tasks that previously required entire teams.",
      author: "Jennifer Chen",
      role: "CTO, TechVentures",
      color: "from-primary to-accent",
    },
    {
      quote:
        "Their AI solutions delivered 3x ROI within 6 months. Best investment we ever made.",
      author: "Marcus Rodriguez",
      role: "CEO, DataFlow Inc",
      color: "from-accent to-primary",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-32 relative overflow-hidden gradient-bg">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4"
          >
            CLIENT <span className="text-primary">SUCCESS</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg lg:text-xl text-secondary-foreground max-w-xl sm:max-w-2xl lg:max-w-3xl"
          >
            Hear from leaders who transformed their businesses
          </motion.p>
        </motion.div>

        {/* Testimonials - Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="relative p-6 sm:p-8 lg:p-10 card-surface rounded-xl lg:rounded-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-102">
                {/* Quote icon */}
                <motion.div
                  className={cn(
                    "absolute -top-4 -left-4 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-2xl",
                    testimonial.color,
                  )}
                  animate={{
                    rotate: [-5, 5, -5],
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <Quote className="h-6 w-8 text-white" />
                </motion.div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-secondary-foreground leading-relaxed mb-6 sm:mb-8">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg",
                      testimonial.color,
                    )}
                  >
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-secondary-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section - Fully Responsive
const ContactSection = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: "success" | "error" | null;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully!",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 lg:py-32 relative overflow-hidden gradient-bg"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4"
          >
            LET'S{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TALK
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg lg:text-xl text-secondary-foreground max-w-xl sm:max-w-2xl lg:max-w-3xl"
          >
            Ready to transform your business with AI? Let's start a
            conversation.
          </motion.p>
        </motion.div>

        {/* Status Message */}
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "mb-6 p-4 rounded-xl text-center",
              submitStatus.type === "success"
                ? "bg-primary/10 border border-primary/30"
                : "bg-destructive/10 border border-destructive/30",
            )}
          >
            {submitStatus.type === "success" ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">
                  {submitStatus.message}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5 text-destructive" />
                <span className="font-semibold text-destructive">
                  {submitStatus.message}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Contact Form - Responsive */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="max-w-2xl sm:max-w-xl lg:max-w-4xl mx-auto"
        >
          <div className="card-surface p-6 sm:p-8 lg:p-10 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-foreground mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 sm:py-4 h-12 border-2 border-border/20 rounded-xl bg-surface focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-foreground mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 sm:py-4 h-12 border-2 border-border/20 rounded-xl bg-surface focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-foreground mb-1"
                >
                  Tell Us About Your Project
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Describe your AI challenge or vision..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 sm:py-4 h-32 sm:h-40 resize-none border-2 border-border/20 rounded-xl bg-surface focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                size="default"
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-xl group-hover:scale-105"
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 sm:h-5 mr-2 border-2 border-t-transparent border-current rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4 sm:h-5" />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer - Fully Responsive
const Footer = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/20 bg-surface/50">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="space-y-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/sutbhutech_logo.png"
                alt="Surbhu Tech"
                className="h-10 w-10 sm:h-10 rounded-full object-contain"
              />
              <span className="text-lg sm:text-xl font-black">
                Surbhu<span className="text-primary">Tech</span>
              </span>
            </div>
            <p className="text-sm sm:text-base text-secondary-foreground">
              Innovating your digital future with intelligent AI solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-foreground">
              Company
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("solutions")}
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("work")}
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-foreground">
              Resources
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-foreground">
              Connect
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-sm sm:text-base text-secondary-foreground hover:text-primary transition-colors w-full"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border/20">
          <p className="text-xs sm:text-sm text-secondary-foreground">
            © 2024 Surbhu Tech. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#"
              className="text-xs sm:text-sm text-secondary-foreground hover:text-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs sm:text-sm text-secondary-foreground hover:text-primary transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <WorkSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
