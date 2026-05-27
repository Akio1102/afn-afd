import {
	type Dispatch,
	memo,
	type SetStateAction,
	useCallback,
	useMemo,
	useState,
} from "react";
import type { Transition } from "@/utils";

interface TransitionEditorProps {
	transitions: Transition[];
	setTransitions: Dispatch<SetStateAction<Transition[]>>;
	states: string[];
	alphabet: string[];
}

export const TransitionEditor = memo(function TransitionEditor({
	transitions,
	setTransitions,
	states,
	alphabet,
}: TransitionEditorProps) {
	const [from, setFrom] = useState("");
	const [sym, setSym] = useState("");
	const [to, setTo] = useState("");

	const selectClass =
		"flex-1 min-w-[70px] bg-input-bg text-text border border-input-border rounded-md px-2 py-1.5 text-xs outline-none";

	const stateOptions = useMemo(
		() =>
			states.map((state) => (
				<option key={state} value={state}>
					{state}
				</option>
			)),
		[states],
	);

	const alphabetOptions = useMemo(
		() =>
			alphabet.map((symbol) => (
				<option key={symbol} value={symbol}>
					{symbol}
				</option>
			)),
		[alphabet],
	);

	const addTransition = useCallback(() => {
		if (!from || !sym || !to) return;

		setTransitions((prev) => [...prev, { from, symbol: sym, to }]);

		setFrom("");
		setSym("");
		setTo("");
	}, [from, sym, to, setTransitions]);

	const removeTransition = useCallback(
		(target: Transition) => {
			setTransitions((prev) =>
				prev.filter(
					(t) =>
						!(
							t.from === target.from &&
							t.symbol === target.symbol &&
							t.to === target.to
						),
				),
			);
		},
		[setTransitions],
	);

	return (
		<div>
			<div className="flex gap-1.5 mb-2 flex-wrap">
				<select
					value={from}
					onChange={(e) => setFrom(e.target.value)}
					className={selectClass}
				>
					<option value="">Desde</option>
					{stateOptions}
				</select>

				<select
					value={sym}
					onChange={(e) => setSym(e.target.value)}
					className={selectClass}
				>
					<option value="">Símbolo</option>
					{alphabetOptions}
					<option value="ε">ε (epsilon)</option>
				</select>

				<select
					value={to}
					onChange={(e) => setTo(e.target.value)}
					className={selectClass}
				>
					<option value="">Hacia</option>
					{stateOptions}
				</select>

				<button
					type="button"
					onClick={addTransition}
					className="px-3.5 bg-accent-glow border border-accent rounded-md text-accent font-semibold cursor-pointer text-xs transition-colors hover:bg-accent hover:text-white"
				>
					+ Agregar
				</button>
			</div>

			<div className="max-h-40 overflow-y-auto space-y-1">
				{transitions.map((transition) => {
					const key = `${transition.from}-${transition.symbol}-${transition.to}`;

					return (
						<div
							key={key}
							className="flex items-center gap-2 px-2.5 py-1 bg-elevated border border-border-normal rounded-md text-xs"
						>
							<span className="font-mono flex-1 text-text">
								{transition.from}{" "}
								<span className="text-text-sub">─{transition.symbol}→</span>{" "}
								{transition.to}
							</span>

							<button
								type="button"
								onClick={() => removeTransition(transition)}
								aria-label={`Eliminar transición ${transition.from} ${transition.symbol} ${transition.to}`}
								className="bg-transparent border-none text-text-muted hover:text-danger cursor-pointer text-base p-1 leading-none"
							>
								×
							</button>
						</div>
					);
				})}

				{transitions.length === 0 && (
					<div className="text-text-muted text-xs text-center py-3">
						Sin transiciones aún
					</div>
				)}
			</div>
		</div>
	);
});
