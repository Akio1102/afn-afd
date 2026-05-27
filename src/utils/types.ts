/**
 * Represents a directed transition between two automaton states.
 *
 * @property from - Identifier of the source state.
 * @property symbol - Input symbol that triggers the transition
 * (may be "ε" for epsilon transitions).
 * @property to - Identifier of the destination state.
 */
export interface Transition {
	from: string;
	symbol: string;
	to: string;
}

/**
 * Represents a single step in the subset construction process
 * used to convert an NFA into a DFA.
 *
 * @property state - Unique identifier of the generated DFA state.
 * @property nfaStates - Set of NFA states represented by this DFA state.
 * @property transitions - Outgoing transitions evaluated from this DFA state.
 * @property transitions.symbol - Input symbol associated with the transition.
 * @property transitions.to - Identifier of the target DFA state.
 * @property transitions.nfaStates - NFA states grouped into the target DFA state.
 */
export interface DFAStep {
	state: string;
	nfaStates: string[];
	transitions: {
		symbol: string;
		to: string;
		nfaStates: string[];
	}[];
}

/**
 * Represents the complete result of the NFA-to-DFA conversion.
 *
 * @property dfaStates - List of all DFA state identifiers.
 * @property dfaAlphabet - DFA alphabet excluding epsilon ("ε").
 * @property dfaTransitions - All transitions defined in the resulting DFA.
 * @property dfaInitial - Identifier of the initial DFA state.
 * @property dfaFinal - List of accepting (final) DFA states.
 * @property steps - Step-by-step trace of the subset construction process.
 * @property dfaStatesMap - Mapping of each DFA state identifier
 * to the corresponding set of NFA states it represents.
 */
export interface DFAResult {
	dfaStates: string[];
	dfaAlphabet: string[];
	dfaTransitions: Transition[];
	dfaInitial: string;
	dfaFinal: string[];
	steps: DFAStep[];
	dfaStatesMap: Map<string, Set<string>>;
}

/**
 * Represents a 2D Cartesian coordinate used for rendering
 * states and transitions on a canvas or SVG.
 *
 * @property x - Horizontal position on the X-axis.
 * @property y - Vertical position on the Y-axis.
 */
export interface Position {
	x: number;
	y: number;
}
