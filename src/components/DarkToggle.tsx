import { memo } from "react";

interface DarkToggleProps {
	dark: boolean;
	onToggle: () => void;
}

export const DarkToggle = memo(function DarkToggle({
	dark,
	onToggle,
}: DarkToggleProps) {
	const label = dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

	return (
		<button
			type="button"
			onClick={onToggle}
			title={label}
			aria-label={label}
			aria-pressed={dark}
			className="flex items-center gap-2 px-3.5 py-1.5 border border-border-med rounded-full cursor-pointer transition-all duration-200 text-xs font-medium text-accent bg-accent-glow dark:bg-elevated"
		>
			<span className="text-base" aria-hidden="true">
				{dark ? "☀️" : "🌙"}
			</span>
			<span>{dark ? "Claro" : "Oscuro"}</span>
		</button>
	);
});
