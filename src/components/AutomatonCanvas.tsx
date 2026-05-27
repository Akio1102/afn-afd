import { memo, useCallback, useMemo } from "react";
import { layoutStates, type Transition } from "@/utils";

interface AutomatonCanvasProps {
	states: string[];
	transitions: Transition[];
	initial: string;
	finalStates: string[];
	title: string;
	isDFA: boolean;
	statesMap?: Map<string, Set<string>> | null;
}

export const AutomatonCanvas = memo(
	({
		states,
		transitions,
		initial,
		finalStates,
		title,
		isDFA,
		statesMap = null,
	}: AutomatonCanvasProps) => {
		const R = 30;
		const W = 760;
		const H = 520;

		const accentColor = isDFA ? "var(--color-success)" : "var(--color-accent)";

		const arrowMarkerId = `ah-${isDFA ? "dfa" : "nfa"}`;

		const positions = useMemo(
			() => layoutStates(states, initial),
			[states, initial],
		);

		const finalStatesSet = useMemo(() => new Set(finalStates), [finalStates]);

		const groupedTransitions = useMemo(() => {
			const groups: Record<string, string[]> = {};

			for (const { from, to, symbol } of transitions) {
				const key = `${from}__${to}`;
				const existing = groups[key];

				if (existing) {
					existing.push(symbol);
				} else {
					groups[key] = [symbol];
				}
			}

			return groups;
		}, [transitions]);

		const getLabelForState = useCallback(
			(state: string) => {
				if (!statesMap) return state;

				const nfaSet = statesMap.get(state);
				return nfaSet ? `{${[...nfaSet].join(",")}}` : state;
			},
			[statesMap],
		);

		return (
			<svg
				width="100%"
				viewBox={`0 0 ${W} ${H}`}
				className="block bg-transparent"
				role="img"
				aria-labelledby="automaton-title"
			>
				<title id="automaton-title">{title}</title>

				<defs>
					<marker
						id={arrowMarkerId}
						viewBox="0 0 10 10"
						refX="9"
						refY="5"
						markerWidth="6"
						markerHeight="6"
						orient="auto-start-reverse"
					>
						<path
							d="M2 1L9 5L2 9"
							fill="none"
							stroke={accentColor}
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</marker>
				</defs>

				<text
					x={W / 2}
					y={28}
					textAnchor="middle"
					fontSize={14}
					fontWeight={500}
					fill="var(--color-text-sub)"
					fontFamily="system-ui, sans-serif"
				>
					{title}
				</text>

				{Object.entries(groupedTransitions).map(([key, symbols]) => {
					const [fromKey, toKey] = key.split("__");
					const from = positions[fromKey];
					const to = positions[toKey];

					if (!from || !to) return null;

					const label = symbols.join(",");

					if (fromKey === toKey) {
						const lx = from.x;
						const ly = from.y - R;

						return (
							<g key={key}>
								<path
									d={`M ${lx - 14} ${ly - 4} C ${lx - 40} ${ly - 55} ${lx + 40} ${ly - 55} ${lx + 14} ${ly - 4}`}
									fill="none"
									stroke={accentColor}
									strokeWidth="1.5"
									markerEnd={`url(#${arrowMarkerId})`}
									opacity={0.75}
								/>
								<text
									x={lx}
									y={ly - 52}
									textAnchor="middle"
									fill={accentColor}
									fontSize={12}
									fontFamily="monospace"
									fontWeight={500}
								>
									{label}
								</text>
							</g>
						);
					}

					const dx = to.x - from.x;
					const dy = to.y - from.y;
					const len = Math.hypot(dx, dy);

					const ux = dx / len;
					const uy = dy / len;

					const sx = from.x + ux * R;
					const sy = from.y + uy * R;

					const ex = to.x - ux * (R + 6);
					const ey = to.y - uy * (R + 6);

					const reverseKey = `${toKey}__${fromKey}`;
					const curve = Object.hasOwn(groupedTransitions, reverseKey) ? 28 : 0;
					const px = (sx + ex) / 2 - uy * curve;
					const py = (sy + ey) / 2 + ux * curve;

					const pathD = curve
						? `M ${sx} ${sy} Q ${px} ${py} ${ex} ${ey}`
						: `M ${sx} ${sy} L ${ex} ${ey}`;

					const labelX = (sx + ex) / 2 - uy * (curve + 14);
					const labelY = (sy + ey) / 2 + ux * (curve + 14);

					return (
						<g key={key}>
							<path
								d={pathD}
								fill="none"
								stroke={accentColor}
								strokeWidth="1.5"
								markerEnd={`url(#${arrowMarkerId})`}
								opacity={0.7}
							/>
							<text
								x={labelX}
								y={labelY}
								textAnchor="middle"
								fill={accentColor}
								fontSize={12}
								fontFamily="monospace"
								fontWeight={500}
							>
								{label}
							</text>
						</g>
					);
				})}

				{states.map((state) => {
					const pos = positions[state];
					if (!pos) return null;

					const isFinal = finalStatesSet.has(state);
					const isInitial = state === initial;

					const label = getLabelForState(state);
					const shortLabel = label.length > 12 ? state : label;

					return (
						<g key={state}>
							{isInitial && (
								<line
									x1={pos.x - R - 28}
									y1={pos.y}
									x2={pos.x - R - 2}
									y2={pos.y}
									stroke={accentColor}
									strokeWidth={1.5}
									markerEnd={`url(#${arrowMarkerId})`}
									opacity={0.7}
								/>
							)}

							{isFinal && (
								<circle
									cx={pos.x}
									cy={pos.y}
									r={R + 6}
									fill="none"
									stroke={accentColor}
									strokeWidth={1}
									opacity={0.45}
									strokeDasharray="3 2"
								/>
							)}

							<circle
								cx={pos.x}
								cy={pos.y}
								r={R}
								fill={
									isInitial
										? isDFA
											? "rgba(45,212,160,0.2)"
											: "rgba(82,69,232,0.2)"
										: "var(--color-node-circle)"
								}
								stroke={accentColor}
								strokeWidth={isFinal ? 2 : 1}
							/>

							<text
								x={pos.x}
								y={pos.y + 1}
								textAnchor="middle"
								dominantBaseline="central"
								fontSize={label.length > 8 ? 9 : 12}
								fontWeight={500}
								fill="var(--color-text)"
								fontFamily="monospace"
							>
								{shortLabel}
							</text>

							{label !== shortLabel && (
								<text
									x={pos.x}
									y={pos.y + R + 16}
									textAnchor="middle"
									fontSize={9}
									fill="var(--color-text-sub)"
									fontFamily="monospace"
								>
									{label}
								</text>
							)}
						</g>
					);
				})}
			</svg>
		);
	},
);

AutomatonCanvas.displayName = "AutomatonCanvas";
