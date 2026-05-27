import {
	type DFAResult,
	type DFAStep,
	epsilonClosure,
	move,
	type Transition,
} from "@/utils";

/**
 * Converts a Non-Deterministic Finite Automaton (NFA)
 * into an equivalent Deterministic Finite Automaton (DFA)
 * using the subset construction algorithm.
 *
 * @param nfaAlphabet - The input alphabet of the NFA (may include ε-transitions).
 * @param nfaTransitions - The transition function of the NFA.
 * @param nfaInitial - The initial state of the NFA.
 * @param nfaFinal - The set of accepting states of the NFA.
 * @returns A `DFAResult` object containing the generated DFA states,
 * transition table, accepting states, and step-by-step conversion details.
 */
export function convertNFAtoDFA(
	nfaAlphabet: string[],
	nfaTransitions: Transition[],
	nfaInitial: string,
	nfaFinal: string[],
): DFAResult {
	const alphabet = nfaAlphabet.filter((a) => a !== "ε");
	const startClosure = epsilonClosure([nfaInitial], nfaTransitions);
	const startKey = [...startClosure].sort().join(",");

	const dfaStatesMap = new Map<string, Set<string>>();
	dfaStatesMap.set(startKey, startClosure);

	const queue = [startKey];
	const dfaTransitions: Transition[] = [];
	const visited = new Set<string>();
	const steps: DFAStep[] = [];

	while (queue.length > 0) {
		const currentKey = queue.shift();
		if (currentKey === undefined || visited.has(currentKey)) continue;
		visited.add(currentKey);

		const currentSet = dfaStatesMap.get(currentKey);
		if (!currentSet) continue;

		const stepEntry: DFAStep = {
			state: currentKey,
			nfaStates: [...currentSet],
			transitions: [],
		};

		for (const sym of alphabet) {
			const moved = move(currentSet, sym, nfaTransitions);
			const closed = epsilonClosure([...moved], nfaTransitions);
			const nextKey = [...closed].sort().join(",");

			if (closed.size > 0) {
				if (!dfaStatesMap.has(nextKey)) {
					dfaStatesMap.set(nextKey, closed);
					queue.push(nextKey);
				}
				dfaTransitions.push({ from: currentKey, symbol: sym, to: nextKey });
				stepEntry.transitions.push({
					symbol: sym,
					to: nextKey,
					nfaStates: [...closed],
				});
			} else {
				stepEntry.transitions.push({ symbol: sym, to: "∅", nfaStates: [] });
			}
		}
		steps.push(stepEntry);
	}

	const dfaStates = [...dfaStatesMap.keys()];
	const dfaFinal = dfaStates.filter((s) => {
		const subStates = dfaStatesMap.get(s);
		if (!subStates) return false;
		return [...subStates].some((ns) => nfaFinal.includes(ns));
	});

	return {
		dfaStates,
		dfaAlphabet: alphabet,
		dfaTransitions,
		dfaInitial: startKey,
		dfaFinal,
		steps,
		dfaStatesMap,
	};
}
