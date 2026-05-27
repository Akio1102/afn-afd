# AFN → AFD · Conversor Interactivo

Aplicación web interactiva para la conversión de Autómatas Finitos No Deterministas (AFN) a Autómatas Finitos Deterministas (AFD) mediante el algoritmo de construcción de subconjuntos, con visualización dinámica en tiempo real de los grafos resultantes.

---

## Vista previa

```
┌─────────────────────┐     ⚡ Conversión     ┌─────────────────────┐
│       AFN           │   ─────────────────►  │       AFD           │
│  q0 ──a──► q0       │   Subconjuntos         │  q0 ──a──► q0,q1   │
│  q0 ──a──► q1       │                        │  q0 ──b──► q0      │
│  q1 ──b──► q2 (F)   │                        │  q0,q1 ──b──► q2   │
└─────────────────────┘                        └─────────────────────┘
```

---

## Características

- **Conversión en tiempo real** — el algoritmo de construcción de subconjuntos se ejecuta instantáneamente al presionar el botón de conversión.
- **Visualización SVG dinámica** — renderizado vectorial de ambos autómatas con nodos, flechas, bucles y doble círculo para estados de aceptación.
- **Soporte de transiciones ε** — cálculo correcto de ε-clausuras para AFN con transiciones épsilon.
- **Vista paso a paso** — tabla detallada de cómo se construyó cada estado del AFD a partir de subconjuntos del AFN.
- **Tabla de transiciones δ** — tabla completa del AFD con marcadores de estado inicial (`→`) y estados de aceptación (`*`).
- **Probador de cadenas** — verifica si una cadena es aceptada o rechazada por el AFD resultante.
- **Ejemplos predefinidos** — tres casos de uso listos para cargar con un clic.
- **Modo oscuro / claro** — toggle con paleta de colores optimizada para ambos modos.
- **Interfaz responsiva** — adaptada para distintos tamaños de pantalla.


---

## Estructura del proyecto

```
afn-afd-conversor/
├── src/
│   ├── components/
│   │   ├── AutomatonCanvas.tsx   # Lienzo SVG del autómata
│   │   ├── TransitionEditor.tsx  # Editor de transiciones del AFN
│   │   └── DarkToggle.tsx        # Toggle de modo oscuro
│   ├── utils/
│   │   └── automata.ts           # Motor lógico de conversión (funciones puras)
│   ├── types/
│   │   └── automata.ts           # Interfaces y tipos del dominio
│   ├── App.tsx                   # Componente raíz y estado global
│   └── main.tsx                  # Punto de entrada
├── public/
├── biome.json                    # Configuración de Biome
├── tsconfig.json
├── rsbuild.config.ts
└── package.json
```

---

## Cómo usar la aplicación

1. **Definir el AFN** — agrega estados, configura el alfabeto Σ, selecciona el estado inicial y los estados de aceptación.
2. **Agregar transiciones** — usa el editor para definir las transiciones δ, incluyendo transiciones ε si aplica.
3. **Convertir** — presiona *Convertir AFN → AFD* para ejecutar el algoritmo.
4. **Explorar el resultado** — navega entre las pestañas para ver el grafo del AFD, los pasos de construcción y la tabla de transiciones.
5. **Probar cadenas** — escribe una cadena y verifica si es aceptada por el AFD resultante.

---

## Algoritmo implementado

El motor de conversión implementa el **algoritmo de construcción de subconjuntos** con los siguientes pasos:

```
1. Calcular ε-clausura({q₀}) → estado inicial del AFD
2. Para cada estado S del AFD no procesado:
   a. Para cada símbolo a ∈ Σ:
      · Calcular move(S, a) → conjunto de estados AFN alcanzables
      · Calcular ε-clausura(move(S, a)) → nuevo estado del AFD
   b. Registrar la transición S ──a──► ε-clausura(move(S, a))
3. Un estado del AFD es de aceptación si contiene al menos
   un estado de aceptación del AFN original
```

---

## Ejemplos incluidos

| Ejemplo | Descripción |
|---|---|
| **Termina en 'ab'** | AFN que acepta cadenas cuyo sufijo es `ab` sobre `{a, b}` |
| **Transición ε** | AFN con transiciones épsilon que acepta `a` o `b` |
| **a\* \| b\*** | AFN que acepta cualquier cantidad de `a` o cualquier cantidad de `b` |

---

## Accesibilidad

El proyecto cumple con las directivas de accesibilidad web (a11y) verificadas por Biome, incluyendo etiquetas semánticas `aria-labelledby` y descripciones `<title>` en todos los elementos SVG.
