import { motion } from "framer-motion";

interface ErrorDisplayProps {
  generationError: string | null;
}

const ErrorDisplay = ({ generationError }: ErrorDisplayProps) => {
  // Early return if no error
  if (!generationError) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-error text-error-content px-4 py-3 rounded-xl shadow-lg max-w-sm z-50"
    >
      <p className="text-sm font-medium">Fehler:</p>
      <p className="text-sm">{generationError}</p>
    </motion.div>
  );
};

export default ErrorDisplay;
