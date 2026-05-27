import type { Position } from "@/utils";

/**
 * Computes a radial layout for automaton states in a two-dimensional space.
 * States are distributed evenly around a circle to ensure
 * clear and balanced visualization.
 *
 * @param states - The list of unique state identifiers to position.
 * @param initial - The initial state, used as the primary reference for angular placement.
 * @returns A `Record<string, Position>` mapping each state identifier
 * to its computed screen coordinates.
 */
export function layoutStates(
	states: string[],
	initial: string,
): Record<string, Position> {
	if (states.length === 0) return {};
	const positions: Record<string, Position> = {};
	const cx = 380;
	const cy = 260;
	const r = 180;

	if (states.length === 1) {
		positions[states[0]] = { x: cx, y: cy };
		return positions;
	}

	const ordered = [initial, ...states.filter((s) => s !== initial)];

	ordered.forEach((s, i) => {
		const angle = (2 * Math.PI * i) / ordered.length - Math.PI / 2;
		positions[s] = {
			x: Math.round(cx + r * Math.cos(angle)),
			y: Math.round(cy + r * Math.sin(angle)),
		};
	});

	return positions;
}
