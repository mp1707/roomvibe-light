import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ResetIcon, BackIcon } from "../../components/Icons";
import { useAppState } from "@/utils/store";
import { useImageModalStore } from "@/utils/useImageModalStore";

const LeftColumn = () => {
	const { localImageUrl } = useAppState();
	const [isDeleteHovered, setIsDeleteHovered] = useState(false);
	const { openModal } = useImageModalStore();

	const handleImageClick = () => {
		if (localImageUrl) {
			openModal(localImageUrl);
		}
	};
	return (
		<motion.div
			className="w-full md:w-1/2 flex flex-col gap-4"
			variants={{
				hidden: { opacity: 0, y: 15 },
				visible: { opacity: 1, y: 0 },
			}}
		>
			<h2 className="font-bold text-2xl text-center">Ihr Originalbild</h2>
			<button
				type="button"
				className="cursor-pointer relative rounded-2xl shadow-xl overflow-hidden"
				onClick={handleImageClick}
			>
				<motion.div
					animate={{
						filter: isDeleteHovered
							? "blur(4px) grayscale(50%)"
							: "blur(0px) grayscale(0%)",
						scale: isDeleteHovered ? 1.03 : 1,
					}}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
					<Image
						src={localImageUrl || "/placeholder.png"}
						className="w-full h-auto object-cover aspect-[4/3]"
						width={800}
						height={600}
						alt="Original uploaded image"
					/>
				</motion.div>

				<AnimatePresence>
					{isDeleteHovered && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className="absolute inset-0 bg-black/40 flex items-center justify-center"
						>
							<ResetIcon />
						</motion.div>
					)}
				</AnimatePresence>
			</button>

			<Link
				href="/"
				onMouseEnter={() => setIsDeleteHovered(true)}
				onMouseLeave={() => setIsDeleteHovered(false)}
			>
				<motion.span
					animate={{ scale: isDeleteHovered ? 1.05 : 1 }}
					transition={{ duration: 0.2 }}
					className="flex justify-center items-center gap-1.5 group group-hover:text-error"
				>
					<BackIcon />
					Anderes Bild hochladen
				</motion.span>
			</Link>
		</motion.div>
	);
};

export default LeftColumn;
