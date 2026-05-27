import type { Transition } from "@/utils";

/**
 * Computes the epsilon closure (ε-closure) of a set of states iteratively.
 * Ensures type safety by explicitly checking for undefined values,
 * avoiding the use of non-null assertions.
 *
 * @param states - The initial set of states used to expand the closure.
 * @param transitions - The transition function of the original automaton.
 * @returns A `Set<string>` containing all states reachable via ε-transitions.
 */
export function epsilonClosure(
	states: string[],
	transitions: Transition[],
): Set<string> {
	const closure = new Set<string>(states);
	const stack = [...states];

	while (stack.length > 0) {
		const s = stack.pop();
		// Validamos de manera segura que s no sea undefined para satisfacer a Biome
		if (s === undefined) continue;

		for (const t of transitions) {
			if (t.from === s && t.symbol === "ε" && !closure.has(t.to)) {
				closure.add(t.to);
				stack.push(t.to);
			}
		}
	}
	return closure;
}

/**
 * Computes the set of states reachable from a given state set
 * by consuming a specific input symbol.
 *
 * @param states - The current set of states.
 * @param symbol - The input symbol to evaluate.
 * @param transitions - The automaton transition function.
 * @returns A `Set<string>` containing all reachable states.
 */
export function move(
	states: Set<string>,
	symbol: string,
	transitions: Transition[],
): Set<string> {
	const result = new Set<string>();
	for (const s of states) {
		for (const t of transitions) {
			if (t.from === s && t.symbol === symbol) {
				result.add(t.to);
			}
		}
	}
	return result;
}
