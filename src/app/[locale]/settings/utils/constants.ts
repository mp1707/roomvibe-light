// Animation variants following design system
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
};

export const containerVariants = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

// Pure function for creating preview images
export const createPreviewImage = (src: string, alt: string) => ({
  src,
  alt,
});

// Preview images data
export const mockGenerationImages = [
  createPreviewImage("/assets/images/mockResult.png", "Mock Ergebnis 1"),
  createPreviewImage("/assets/images/hero.png", "Mock Ergebnis 2"),
];

export const mockUploadImage = createPreviewImage(
  "https://media.istockphoto.com/id/2175713816/de/foto/elegantes-wohnzimmer-mit-beigem-sofa-und-kamin.jpg?s=2048x2048&w=is&k=20&c=E9JrU7zYWFLQsEJQf0fXJyiVECM6tsIyKgSNNp-cEkc%3D",
  "Mock Upload Beispiel"
);
