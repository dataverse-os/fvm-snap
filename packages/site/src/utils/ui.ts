export const ease = ({
  duration = 0.5,
  ease = "easeInOut",
}: {
  duration?: number;
  ease?: string;
}) => ({
  type: "tween",
  delay: 0,
  duration,
  ease,
});

export const easeTransition = ease({});

export const fadeInVariants = {
  hidden: {
    opacity: 0,
    transition: ease({ ease: "easeIn", duration: 0.3 }),
  },
  show: {
    opacity: 1,
    transition: ease({ ease: "easeOut", duration: 0.3 }),
  },
};

export const rotateXVariants = {
  initial: {
    transform: "rotateX(0deg)",
    transition: ease({ duration: 0.3 }),
  },
  animate: {
    transform: "rotateX(180deg)",
    transition: ease({ duration: 0.3 }),
  },
};
