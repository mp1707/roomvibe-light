import type React from "react";
import { motion } from "motion/react";

const GlowingBorder = ({
	children,
    className
}: {
	children: React.ReactNode;
    className?: string;
}) => {
	return (
        <motion.div
            className={`p-1 rounded-xl bg-gradient-to-r from-blue-400 via-fuchsia-500 to-amber-500 ${className ?? ""}`}
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{
                backgroundPosition: {
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                },
            }}
            style={{
                backgroundSize: "400% 400%",
            }}
        >
            <div className="bg-white p-1 rounded-lg">{children}</div>
        </motion.div>
	);
};

export default GlowingBorder;
