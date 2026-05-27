import type { Transition } from "@/utils";

export interface AutomatonExample {
	name: string;
	states: string[];
	alphabet: string[];
	initial: string;
	final: string[];
	transitions: Transition[];
}

export const EXAMPLES: AutomatonExample[] = [
	{
		name: "Termina en 'ab'",
		states: ["q0", "q1", "q2"],
		alphabet: ["a", "b"],
		initial: "q0",
		final: ["q2"],
		transitions: [
			{ from: "q0", symbol: "a", to: "q0" },
			{ from: "q0", symbol: "b", to: "q0" },
			{ from: "q0", symbol: "a", to: "q1" },
			{ from: "q1", symbol: "b", to: "q2" },
		],
	},
	{
		name: "Transición ε",
		states: ["q0", "q1", "q2", "q3"],
		alphabet: ["a", "b"],
		initial: "q0",
		final: ["q3"],
		transitions: [
			{ from: "q0", symbol: "ε", to: "q1" },
			{ from: "q0", symbol: "ε", to: "q2" },
			{ from: "q1", symbol: "a", to: "q3" },
			{ from: "q2", symbol: "b", to: "q3" },
		],
	},
	{
		name: "a* | b*",
		states: ["q0", "q1", "q2", "q3", "q4"],
		alphabet: ["a", "b"],
		initial: "q0",
		final: ["q1", "q3"],
		transitions: [
			{ from: "q0", symbol: "ε", to: "q1" },
			{ from: "q0", symbol: "ε", to: "q3" },
			{ from: "q1", symbol: "a", to: "q2" },
			{ from: "q2", symbol: "ε", to: "q1" },
			{ from: "q3", symbol: "b", to: "q4" },
			{ from: "q4", symbol: "ε", to: "q3" },
		],
	},
];
