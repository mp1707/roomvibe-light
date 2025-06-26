interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

export const ProcessStep = ({
  icon,
  title,
  description,
  bgColor,
  iconColor,
}: ProcessStepProps) => (
  <div className="flex items-center space-x-4 p-3 rounded-lg bg-base-100/50 border border-base-300/30">
    <div
      className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}
    >
      <svg
        className={`w-5 h-5 ${iconColor}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icon}
      </svg>
    </div>
    <div>
      <h3 className="font-semibold text-base-content">{title}</h3>
      <p className="text-sm text-base-content/60">{description}</p>
    </div>
  </div>
);

export default ProcessStep;
