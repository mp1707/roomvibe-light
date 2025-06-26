interface FeatureIndicatorProps {
  label: string;
  color: string;
}

export const FeatureIndicator = ({ label, color }: FeatureIndicatorProps) => (
  <div className="flex items-center space-x-2">
    <div className={`w-2 h-2 ${color} rounded-full`} />
    <span className="text-sm text-base-content/70">{label}</span>
  </div>
);

export default FeatureIndicator;
