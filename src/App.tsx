import { useCallback, useEffect, useMemo, useState } from "react";
import { AutomatonCanvas, DarkToggle, TransitionEditor } from "@/components";
import { convertNFAtoDFA, type DFAResult, type Transition } from "@/utils";
import { type AutomatonExample, EXAMPLES } from "./constants/examples";

export default function App() {
	const [dark, setDark] = useState(false);
	const [nfaStates, setNfaStates] = useState<string[]>(["q0", "q1", "q2"]);
	const [nfaAlphabet, setNfaAlphabet] = useState<string[]>(["a", "b"]);
	const [nfaTransitions, setNfaTransitions] = useState<Transition[]>([
		{ from: "q0", symbol: "a", to: "q0" },
		{ from: "q0", symbol: "b", to: "q0" },
		{ from: "q0", symbol: "a", to: "q1" },
		{ from: "q1", symbol: "b", to: "q2" },
	]);
	const [nfaInitial, setNfaInitial] = useState("q0");
	const [nfaFinal, setNfaFinal] = useState<string[]>(["q2"]);

	const [newState, setNewState] = useState("");
	const [newSymbol, setNewSymbol] = useState("");
	const [result, setResult] = useState<DFAResult | null>(null);
	const [activeTab, setActiveTab] = useState("nfa");
	const [testString, setTestString] = useState("");
	const [testResult, setTestResult] = useState<boolean | null>(null);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark]);

	const convert = useCallback(() => {
		const r = convertNFAtoDFA(
			nfaAlphabet,
			nfaTransitions,
			nfaInitial,
			nfaFinal,
		);

		setResult(r);
		setActiveTab("dfa");
		setTestResult(null);
		setTestString("");
	}, [nfaAlphabet, nfaTransitions, nfaInitial, nfaFinal]);

	const loadExample = useCallback((ex: AutomatonExample) => {
		setNfaStates(ex.states);
		setNfaAlphabet(ex.alphabet);
		setNfaTransitions(ex.transitions);
		setNfaInitial(ex.initial);
		setNfaFinal(ex.final);
		setResult(null);
		setTestResult(null);
		setTestString("");
	}, []);

	const transitionMap = useMemo(() => {
		if (!result) return new Map<string, string>();

		return new Map(
			result.dfaTransitions.map((t) => [`${t.from}-${t.symbol}`, t.to]),
		);
	}, [result]);

	const runTest = useCallback(() => {
		if (!result) return;

		let current = result.dfaInitial;

		for (const ch of testString) {
			const next = transitionMap.get(`${current}-${ch}`);

			if (!next) {
				setTestResult(false);
				return;
			}

			current = next;
		}

		setTestResult(result.dfaFinal.includes(current));
	}, [result, testString, transitionMap]);

	const addState = useCallback(() => {
		const s = newState.trim();
		if (s && !nfaStates.includes(s)) {
			setNfaStates((p) => [...p, s]);
			setNewState("");
		}
	}, [newState, nfaStates]);

	const removeState = useCallback(
		(state: string) => {
			setNfaStates((prev) => prev.filter((x) => x !== state));
			setNfaTransitions((prev) =>
				prev.filter((t) => t.from !== state && t.to !== state),
			);

			if (nfaInitial === state) {
				setNfaInitial(nfaStates.find((x) => x !== state) ?? "");
			}

			setNfaFinal((prev) => prev.filter((x) => x !== state));
		},
		[nfaInitial, nfaStates],
	);

	const addSymbol = useCallback(() => {
		const s = newSymbol.trim();
		if (s && !nfaAlphabet.includes(s) && s !== "ε") {
			setNfaAlphabet((p) => [...p, s]);
			setNewSymbol("");
		}
	}, [newSymbol, nfaAlphabet]);

	const removeSymbol = useCallback((symbol: string) => {
		setNfaAlphabet((prev) => prev.filter((x) => x !== symbol));

		setNfaTransitions((prev) => prev.filter((t) => t.symbol !== symbol));
	}, []);

	const toggleDark = useCallback(() => {
		setDark((prev) => !prev);
	}, []);

	return (
		<div className="font-mono bg-bg min-h-screen pb-12 transition-colors duration-250 text-text">
			<link
				href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
				rel="stylesheet"
			/>

			{/* HEADER */}
			<header className="bg-gradient-to-r from-[#4337D4] via-[#5B4CF5] to-[#9D85F7] dark:from-[#1A1440] dark:via-[#241C58] dark:to-[#3A2D88] rounded-b-2xl px-8 py-5 mb-5 text-white flex items-center justify-between flex-wrap gap-3 shadow-md">
				<div>
					<div className="flex items-center gap-3 mb-1">
						<svg
							width="26"
							height="26"
							viewBox="0 0 24 24"
							fill="none"
							role="img"
							aria-labelledby="logo-title"
						>
							<title id="logo-title">Icono del conversor AFN a AFD</title>{" "}
							<circle cx="5" cy="12" r="3" stroke="#fff" strokeWidth="1.5" />
							<circle cx="19" cy="6" r="3" stroke="#fff" strokeWidth="1.5" />
							<circle cx="19" cy="18" r="3" stroke="#fff" strokeWidth="1.5" />
							<line
								x1="8"
								y1="11"
								x2="16"
								y2="7"
								stroke="#fff"
								strokeWidth="1.5"
							/>
							<line
								x1="8"
								y1="13"
								x2="16"
								y2="17"
								stroke="#fff"
								strokeWidth="1.5"
							/>
						</svg>
						<span className="text-xl font-semibold tracking-tight">
							AFN → AFD
						</span>
						<span className="bg-white/20 dark:bg-white/10 rounded-md px-2.5 py-0.5 text-[11px]">
							Construcción de subconjuntos
						</span>
					</div>
					<p className="m-0 text-xs text-white/80">
						Conversor interactivo con visualización paso a paso
					</p>
				</div>
				<DarkToggle dark={dark} onToggle={toggleDark} />
			</header>

			<main className="max-w-[1100px] mx-auto px-4">
				{/* EJEMPLOS */}
				<div className="section-card">
					<div className="section-label">Ejemplos Predefinidos</div>
					<div className="flex gap-2 flex-wrap">
						{EXAMPLES.map((ex) => (
							<button
								type="button"
								key={ex.name}
								onClick={() => loadExample(ex)}
								className="tab-base"
							>
								{ex.name}
							</button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-4 items-start">
					{/* PANEL IZQUIERDO */}
					<section>
						{/* Estados */}
						<div className="section-card">
							<div className="section-label">Estados Q</div>
							<div className="flex gap-1.5 mb-2.5">
								<input
									value={newState}
									onChange={(e) => setNewState(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && addState()}
									placeholder="ej: q3"
									className="input-base"
								/>
								<button
									type="button"
									onClick={addState}
									className="px-3.5 bg-accent text-white border-none rounded-md font-semibold cursor-pointer text-sm transition-transform active:scale-95"
								>
									+
								</button>
							</div>
							<div className="flex flex-wrap gap-1 mb-3">
								{nfaStates.map((s) => {
									const isInit = s === nfaInitial;
									const isFin = nfaFinal.includes(s);
									return (
										<span
											key={s}
											className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors border ${isInit ? "bg-accent/15 text-accent border-accent" : isFin ? "bg-success/15 text-success border-success" : "bg-elevated text-text-sub border-border-normal"}`}
										>
											{s}
											{isInit && (
												<span className="text-[9px] opacity-75">(inicio)</span>
											)}
											{isFin && (
												<span className="text-[9px] opacity-75">(final)</span>
											)}
											<button
												type="button"
												onClick={() => removeState(s)}
												aria-label={`Eliminar estado ${s}`}
												className="cursor-pointer opacity-50 hover:opacity-100 ml-0.5"
											>
												×
											</button>
										</span>
									);
								})}
							</div>
							<div className="flex gap-2.5 mt-3 border-t border-border-faint pt-2.5">
								<div className="flex-1">
									<div className="text-[11px] text-text-muted mb-1">
										Estado inicial
									</div>
									<select
										value={nfaInitial}
										onChange={(e) => setNfaInitial(e.target.value)}
										className="input-base cursor-pointer"
									>
										{nfaStates.map((s) => (
											<option key={s} value={s}>
												{s}
											</option>
										))}
									</select>
								</div>
								<div className="flex-1">
									<div className="text-[11px] text-text-muted mb-1">
										Estados finales
									</div>
									<div className="space-y-1 max-h-24 overflow-y-auto">
										{nfaStates.map((s) => (
											<label
												key={s}
												className="flex items-center gap-1.5 text-xs cursor-pointer text-text hover:text-accent"
											>
												<input
													type="checkbox"
													checked={nfaFinal.includes(s)}
													className="accent-accent"
													onChange={(e) =>
														setNfaFinal((p) =>
															e.target.checked
																? [...p, s]
																: p.filter((x) => x !== s),
														)
													}
												/>
												{s}
											</label>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Alfabeto */}
						<div className="section-card">
							<div className="section-label">Alfabeto Σ</div>
							<div className="flex gap-1.5 mb-2.5">
								<input
									value={newSymbol}
									onChange={(e) => setNewSymbol(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && addSymbol()}
									placeholder="ej: c"
									className="input-base"
								/>
								<button
									type="button"
									onClick={addSymbol}
									className="px-3.5 bg-accent text-white border-none rounded-md font-semibold cursor-pointer text-sm transition-transform active:scale-95"
								>
									+
								</button>
							</div>
							<div className="flex flex-wrap gap-1">
								{nfaAlphabet.map((a) => (
									<span
										key={a}
										className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-info/15 text-info border border-info"
									>
										<span className="font-mono">{a}</span>
										<button
											type="button"
											onClick={() => removeSymbol(a)}
											aria-label={`Eliminar símbolo ${a}`}
											className="cursor-pointer opacity-50 hover:opacity-100"
										>
											×
										</button>
									</span>
								))}
								<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-elevated text-text-sub border border-border-normal">
									<span className="font-mono text-[11px]">ε implícito</span>
								</span>
							</div>
						</div>

						{/* Transiciones */}
						<div className="section-card">
							<div className="section-label">Transiciones δ</div>
							<TransitionEditor
								transitions={nfaTransitions}
								setTransitions={setNfaTransitions}
								states={nfaStates}
								alphabet={nfaAlphabet}
							/>
						</div>

						<button
							type="button"
							onClick={convert}
							className="w-full py-3 text-sm font-semibold text-white border-none rounded-xl cursor-pointer tracking-wide bg-gradient-to-r from-accent to-accent-hover shadow-md shadow-accent/20 transition-all duration-150 active:scale-[0.98]"
						>
							⚡ Convertir AFN → AFD
						</button>

						{/* Probar Cadena */}
						{result && (
							<div className="section-card mt-3.5">
								<div className="section-label">Probar Cadena</div>
								<div className="flex gap-1.5">
									<input
										value={testString}
										onChange={(e) => setTestString(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && runTest()}
										placeholder="ej: ab..."
										className="input-base"
									/>
									<button
										type="button"
										onClick={runTest}
										className="px-4 bg-accent text-white border-none rounded-md font-semibold cursor-pointer transition-colors hover:bg-accent-hover"
									>
										▶
									</button>
								</div>
								{testResult !== null && (
									<div
										className={`mt-2.5 p-2.5 border rounded-lg text-xs font-medium transition-colors ${testResult ? "bg-success-bg border-success text-success" : "bg-danger-bg border-danger text-danger"}`}
									>
										{testResult
											? `✓ La cadena "${testString}" es ACEPTADA`
											: `✗ La cadena "${testString}" es RECHAZADA`}
									</div>
								)}
							</div>
						)}
					</section>

					{/* PANEL DERECHO */}
					<section>
						<div className="flex gap-1.5 mb-3 flex-wrap">
							{(["nfa", "dfa", "steps", "table"] as const).map((tab) => (
								<button
									type="button"
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={activeTab === tab ? "tab-active" : "tab-base"}
								>
									{
										{
											nfa: "AFN Original",
											dfa: "AFD Resultante",
											steps: "Pasos",
											table: "Tabla δ",
										}[tab]
									}
								</button>
							))}
						</div>

						{activeTab === "nfa" && (
							<div className="section-card">
								<div className="section-label">
									Autómata Finito No Determinista — {nfaStates.length} estados
								</div>
								<div className="border border-border-normal rounded-lg overflow-hidden bg-canvas-bg shadow-inner">
									<AutomatonCanvas
										states={nfaStates}
										transitions={nfaTransitions}
										initial={nfaInitial}
										finalStates={nfaFinal}
										title="AFN"
										isDFA={false}
									/>
								</div>
							</div>
						)}

						{activeTab === "dfa" && (
							<div className="section-card">
								{result ? (
									<>
										<div className="section-label mb-2.5">
											Autómata Finito Determinista — {result.dfaStates.length}{" "}
											estados
										</div>
										<div className="border border-border-normal rounded-lg overflow-hidden bg-canvas-bg shadow-inner">
											<AutomatonCanvas
												states={result.dfaStates}
												transitions={result.dfaTransitions}
												initial={result.dfaInitial}
												finalStates={result.dfaFinal}
												title="AFD"
												isDFA={true}
												statesMap={result.dfaStatesMap}
											/>
										</div>
									</>
								) : (
									<div className="text-text-muted text-xs text-center py-8">
										Haz clic en "Convertir AFN → AFD" primero
									</div>
								)}
							</div>
						)}

						{activeTab === "steps" && (
							<div className="section-card">
								<div className="section-label mb-2.5">
									Cálculo del subconjunto paso a paso
								</div>
								{result ? (
									<div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
										{result.steps.map((step, idx) => (
											<div
												key={step.state}
												className="p-3 bg-elevated border border-border-normal rounded-lg text-xs space-y-1"
											>
												<div className="font-semibold text-text">
													Paso {idx + 1}: Estado AFD{" "}
													<span className="text-accent">"{step.state}"</span> ➔
													Subconjunto: [{step.nfaStates.join(", ")}]
												</div>
												<div className="pl-3 border-l border-border-med space-y-1 mt-1 text-text-muted">
													{step.transitions.map((tr) => (
														<div
															key={`${tr.symbol}-${tr.to}`}
															className="font-mono"
														>
															Con Símbolo{" "}
															<span className="text-info font-bold">
																'{tr.symbol}'
															</span>{" "}
															➔{" "}
															{tr.to === "∅" ? (
																<span className="text-danger">∅ (Vacío)</span>
															) : (
																<>
																	Va a{" "}
																	<span className="text-success font-bold">
																		"{tr.to}"
																	</span>
																</>
															)}
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-text-muted text-xs text-center py-8">
										Haz clic en "Convertir AFN → AFD" primero
									</div>
								)}
							</div>
						)}

						{activeTab === "table" && (
							<div className="section-card">
								<div className="section-label mb-2.5">
									Tabla de Transición del AFD (δ)
								</div>
								{result ? (
									<div className="overflow-x-auto border border-border-normal rounded-lg">
										<table className="w-full text-left border-collapse text-xs">
											<thead>
												<tr className="bg-elevated border-b border-border-normal text-text-muted">
													<th className="p-2.5 font-semibold">
														Estado AFD (Subconjunto)
													</th>
													{result.dfaAlphabet.map((sym) => (
														<th
															key={sym}
															className="p-2.5 font-semibold text-center"
														>
															Con '{sym}'
														</th>
													))}
												</tr>
											</thead>
											<tbody className="divide-y divide-border-faint text-text">
												{result.dfaStates.map((state) => (
													<tr
														key={state}
														className="hover:bg-overlay/30 transition-colors"
													>
														<td className="p-2.5 font-mono font-medium">
															{state === result.dfaInitial && (
																<span className="text-accent mr-1">➔</span>
															)}
															{result.dfaFinal.includes(state) && (
																<span className="text-success mr-1">★</span>
															)}
															{state}{" "}
															<span className="text-[11px] text-text-muted">
																(
																{`{${[
																	...(result.dfaStatesMap.get(state) ?? []),
																].join(", ")}}`}{" "}
																)
															</span>
														</td>
														{result.dfaAlphabet.map((sym) => {
															const trans = result.dfaTransitions.find(
																(t) => t.from === state && t.symbol === sym,
															);
															return (
																<td
																	key={sym}
																	className="p-2.5 font-mono text-center text-text-sub"
																>
																	{trans ? (
																		trans.to
																	) : (
																		<span className="text-text-faint">∅</span>
																	)}
																</td>
															);
														})}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : (
									<div className="text-text-muted text-xs text-center py-8">
										Haz clic en "Convertir AFN → AFD" primero
									</div>
								)}
							</div>
						)}
					</section>
				</div>
			</main>
		</div>
	);
}
