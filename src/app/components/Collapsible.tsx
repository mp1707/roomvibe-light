import type React from "react";

interface CollapsibleProps {
	title: string;
	children: React.ReactNode;
	name: string;
	defaultChecked?: boolean;
	className?: string;
}

const Collapsible: React.FC<CollapsibleProps> = ({
	title,
	children,
	name,
	defaultChecked,
	className = "",
}) => (
	<div className={`collapse collapse-arrow join-item  ${className}`}>
		<input type="radio" name={name} defaultChecked={defaultChecked} />
		<div className="collapse-title font-semibold">{title}</div>
		<div className="collapse-content text-sm ">{children}</div>
	</div>
);

export default Collapsible;
