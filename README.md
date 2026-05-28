# Simulador "Nave Tierra" — Centro de reciclaje de RAEE

**Avance 2 — Trabajo Final Integrador de Simulación**
Universidad Tecnológica Nacional · Facultad Regional Tucumán · Comisión 4K3 — Grupo 04

---

## Tabla de contenidos

1. [¿Qué hace este proyecto?](#1-qué-hace-este-proyecto)
2. [El sistema simulado: Nave Tierra](#2-el-sistema-simulado-nave-tierra)
3. [Cómo funciona la simulación, paso a paso](#3-cómo-funciona-la-simulación-paso-a-paso)
4. [El generador de números aleatorios (Congruencial Mixto)](#4-el-generador-de-números-aleatorios-congruencial-mixto)
5. [Distribuciones de probabilidad utilizadas](#5-distribuciones-de-probabilidad-utilizadas)
6. [Arquitectura del software](#6-arquitectura-del-software)
7. [Estructura del proyecto (archivos)](#7-estructura-del-proyecto-archivos)
8. [Cómo correrlo](#8-cómo-correrlo)
9. [Cómo usar la interfaz](#9-cómo-usar-la-interfaz)
10. [Las cinco ventanas de resultados](#10-las-cinco-ventanas-de-resultados)
11. [Las tres decisiones automáticas del modelo](#11-las-tres-decisiones-automáticas-del-modelo)
12. [Tests del motor](#12-tests-del-motor)
13. [Deploy en Netlify](#13-deploy-en-netlify)
14. [Notas y limitaciones conocidas](#14-notas-y-limitaciones-conocidas)

---

## 1. ¿Qué hace este proyecto?

Este software **simula durante un mes (30 jornadas laborables de 8 horas) la operación de un centro de reciclaje de RAEE** (Residuos de Aparatos Eléctricos y Electrónicos) llamado **Nave Tierra**, ubicado en San Miguel de Tucumán.

A partir de unos pocos parámetros que el usuario carga (semilla del generador aleatorio, cantidad de días, etc.), el software:

1. Genera números pseudoaleatorios con un método congruencial sembrado.
2. Usa esos números para sortear, día por día y equipo por equipo, qué pasa con cada residuo que llega al centro (tipo de dispositivo, peso, tiempos de proceso, destino, eficacia ambiental).
3. Acumula todas las métricas que el cliente del centro necesita ver: equipos procesados por tipo, peso total, litros de agua no contaminada, incidentes de contaminación, tiempos totales de cada estación, etc.
4. Evalúa **tres alternativas de decisión** (¿conviene contratar otro operario? ¿otro recepcionista? ¿abrir un segundo turno?) según los umbrales del modelo.
5. Muestra todo en cinco "ventanas" diferentes (pestañas): resumen mensual, desglose diario, grilla de eventos, decisiones y validación del generador. Incluye gráficos (donuts, barras, líneas, histograma) que permiten "ver" la simulación, no solo leerla.

Todo corre **dentro del navegador** del usuario: no hay servidor, ni base de datos, ni llamadas a internet. Esto hace que la simulación sea instantánea, totalmente reproducible y muy fácil de desplegar.

> **Reproducibilidad:** dada la misma semilla y los mismos parámetros, la simulación siempre arroja exactamente el mismo resultado. Eso permite revisar, debuggear y presentar los mismos números en la defensa que vieron en el desarrollo.

---

## 2. El sistema simulado: Nave Tierra

Nave Tierra recibe lotes de equipos electrónicos en desuso (servidores, switches/routers industriales y equipos de red hogareños). Cada equipo es:

1. **Recepcionado** por 1 operario (registra tipo, peso y estado).
2. **Diagnosticado** por 2 operarios especializados, que deciden el destino:
   - **Reutilización** (equipo funcional, ~10 %),
   - **Desarme** (recuperación de componentes, ~75 %), o
   - **Disposición final** (irrecuperable, ~15 %).
3. Si va a desarme, se desarma manualmente.
4. Finalmente, el procesamiento se considera **correcto** en el 99,05 % de los casos; en el 0,95 % restante hay un **incidente de contaminación menor**.

El centro genera valor recuperando equipos y, sobre todo, **evita contaminación**: por cada equipo procesado correctamente se evita la contaminación de un volumen de agua (50.000 L por servidor, 15.000 L por switch/router, 3.000 L por hogareño).

El **responsable de Nave Tierra** quiere saber, después de simular un mes:

- ¿Cuántos equipos se procesaron, de qué tipo y con qué destino?
- ¿Cuánta agua se evitó contaminar?
- ¿Cuántos incidentes hubo?
- ¿La línea da abasto o conviene sumar personal / habilitar un segundo turno?

---

## 3. Cómo funciona la simulación, paso a paso

El cerebro de la simulación está en [src/engine/simulation.js](src/engine/simulation.js). Es **una implementación literal del diagrama de flujo (.drawio) del grupo**, no una variante.

### 3.1 La idea general

La simulación es un modelo de **acumulación / Monte Carlo**: en lugar de avanzar un reloj continuo de tiempo, recorre **día por día, lote por lote, equipo por equipo**, y para cada equipo:

- Sortea valores aleatorios.
- Aplica fórmulas del modelo.
- Suma resultados a contadores globales.

Al final de los 30 días, los contadores son las métricas mensuales del cliente.

### 3.2 Las variables del modelo

Todas estas siglas son las que aparecen en el diagrama de flujo y en el glosario del propio software. Se inicializan en `0` (excepto `d=1`) y se van actualizando:

| Sigla   | Qué representa                                | Unidad   |
| ------- | --------------------------------------------- | -------- |
| `d`     | Día actual (1..30)                            | día      |
| `L`     | Lotes que llegaron ese día                    | lotes    |
| `CE`    | Equipos que vienen en el lote actual          | equipos  |
| `u`     | Número aleatorio uniforme (0 ≤ u < 1)         | —        |
| `CS`    | Total de servidores procesados                | equipos  |
| `CR`    | Total de switch/routers procesados            | equipos  |
| `ER`    | Total de hogareños procesados                 | equipos  |
| `PT`    | Peso total procesado                          | kg       |
| `EF`    | Equipos funcionales (van a reutilización)     | equipos  |
| `ED`    | Equipos enviados a desarme                    | equipos  |
| `EI`    | Equipos irrecuperables (disposición final)    | equipos  |
| `PE`    | Incidentes de contaminación                   | eventos  |
| `TA`    | Litros de agua no contaminada                 | litros   |
| `TTR`   | Tiempo total de recepción                     | minutos  |
| `TTD`   | Tiempo total de diagnóstico                   | minutos  |
| `TTDD`  | Tiempo total de desarme                       | minutos  |
| `TT`    | Tiempo total = `TTD + TTDD`                   | minutos  |
| `TEP`   | Total de equipos procesados = `CS + CR + ER`  | equipos  |

> Los tipos están numerados: **Tipo 1 = Servidor, Tipo 2 = Switch/Router, Tipo 3 = Hogareño**.

### 3.3 El algoritmo (tres bucles anidados)

```
inicializar todas las variables en 0; d ← 1

para d desde 1 hasta 30:
  L ← Poisson(λ = 6)            // cuántos lotes llegan ese día
  para i desde 1 hasta L:
    CE ← INT(5 + 10·u)          // cuántos equipos vienen en este lote (5..14)
    para e desde 1 hasta CE:
      ... procesar 1 equipo (ver 3.4) ...

al terminar los 30 días:
  TEP ← CS + CR + ER
  TT  ← TTD + TTDD
  evaluar las 3 decisiones
```

### 3.4 Qué pasa con cada equipo

Por cada equipo se consumen varios números aleatorios (uno por cada variable que se sortea). El orden es importante porque la grilla muestra **qué `u` produjo qué valor** (auditoría):

1. **Tipo de equipo** — se sortea `u₁`:
   - si `u₁ ≤ 0,25` → Servidor (`CS ← CS + 1`)
   - si `0,25 < u₁ ≤ 0,70` → Switch/Router (`CR ← CR + 1`)
   - si no → Hogareño (`ER ← ER + 1`)

2. **Peso del equipo (kg)** — se sortea `u₂`:
   `peso = 0,5 + 19,5 · u₂`  → rango 0,5..20 kg. Se acumula en `PT`.
   *(El diagrama usa la misma fórmula para los tres tipos.)*

3. **Tiempo de recepción (min)** — se sortean **dos** `u` (Box-Muller para la Normal):
   `TR ~ Normal(μ = 2 ; σ = 0,5)`. Se acumula en `TTR`.

4. **Tiempo de diagnóstico (min)** — se sortea `u₃`:
   `TD = 3 + 9 · u₃` → rango 3..12 min. Se acumula en `TTD`.

5. **Destino del diagnóstico** — se sortea `u₄`:
   - si `u₄ ≤ 0,10` → Reutilización (`EF ← EF + 1`)
   - si `0,10 < u₄ ≤ 0,85` → Desarme (`ED ← ED + 1`)
     y entonces se sortea `u₅`: `TDD = 5 + 50 · u₅` → rango 5..55 min. Se acumula en `TTDD`.
   - si no → Disposición (`EI ← EI + 1`)

6. **Eficacia del procesamiento** — se sortea `u₆`:
   - si `u₆ ≤ 0,9905` → procesado OK: sumar agua según el tipo
     (Servidor: +50.000 L, Switch/Router: +15.000 L, Hogareño: +3.000 L) a `TA`.
   - si no → Incidente de contaminación (`PE ← PE + 1`).

> **En total se consumen entre 7 y 8 números aleatorios por equipo** (7 si va a reutilización o disposición, 8 si va a desarme). Con la semilla `2000` por defecto, el mes completo consume ≈ **14.400 números aleatorios**.

---

## 4. El generador de números aleatorios (Congruencial Mixto)

Todos los `u` salen de un **único generador sembrado** implementado en [src/engine/rng.js](src/engine/rng.js). No se usa `Math.random()` del navegador (no es reproducible).

El método es el **Congruencial Mixto** de la Clase 1:

$$
n_{i+1} = (a \cdot n_i + c) \bmod m \qquad u_i = \frac{n_i}{m}
$$

Con las constantes estándar de la librería de C (`glibc`):

| Parámetro | Valor                | Significado            |
| --------- | -------------------- | ---------------------- |
| `a`       | `1.103.515.245`      | Constante multiplicativa |
| `c`       | `12.345`             | Constante aditiva      |
| `m`       | `2.147.483.648` (2³¹)| Módulo                 |
| `n₀`      | `semilla` del form   | Valor inicial          |

**Detalle técnico crítico:** con `a` y `n` tan grandes, el producto `a · n` supera la precisión de los `number` de JavaScript (2⁵³). Si se calculara con `Number`, los últimos dígitos se perderían y el generador entregaría números equivocados. Por eso el paso congruencial se hace con **`BigInt`** (enteros de precisión arbitraria) y el resultado se convierte a `Number` solo para calcular `u = n/m`. Eso garantiza que la secuencia sea matemáticamente exacta.

> **¿Para qué sirve la semilla?** Es el valor inicial `n₀`. Cambiarla cambia toda la secuencia de números aleatorios y por lo tanto el resultado de la simulación. Con la misma semilla, los resultados son idénticos en cualquier computadora.

---

## 5. Distribuciones de probabilidad utilizadas

Todas se implementan en [src/engine/distributions.js](src/engine/distributions.js) **a partir del generador uniforme** (no hay otra fuente de aleatoriedad).

| Distribución | Para qué se usa                       | Cómo se genera                                         |
| ------------ | ------------------------------------- | ------------------------------------------------------ |
| Uniforme entera | Cantidad de equipos por lote        | `INT(5 + 10·u)` (transformada directa del `u`)         |
| Uniforme     | Peso, tiempo de diagnóstico, tiempo de desarme | `a + (b-a)·u`                                |
| Normal       | Tiempo de recepción `Normal(2 ; 0,5)` | **Box-Muller** consumiendo siempre 2 `u`, con `clamp ≥ 0` |
| Poisson      | Lotes por día `Poisson(6)`            | Algoritmo **multiplicativo de Knuth**                  |
| Discreta por tabla | Tipo de equipo, destino, eficacia | **Cortes acumulados**: comparar `u` contra `[0.25, 0.70]`, etc. |

Cada función devuelve no solo el valor, sino **también el `u` (o los `u`) que consumió**, para que la grilla pueda mostrarlos en columnas dedicadas. Eso es exactamente el estilo "vector de estado" que se usa en los TPs de la cátedra.

---

## 6. Arquitectura del software

```
┌───────────────────────────────────────────────────────────┐
│                          NAVEGADOR                         │
│                                                            │
│  ┌──────────────────┐    ┌─────────────────────────────┐  │
│  │   UI (React)     │───▶│   MOTOR (JS puro, sin DOM)  │  │
│  │ EntradasSimul.   │    │  rng → distributions →      │  │
│  │ ResultadosTabs   │◀───│  simulation                 │  │
│  └──────────────────┘    └─────────────────────────────┘  │
│                                                            │
└───────────────────────────────────────────────────────────┘
                  ▲
                  │ HTTPS estático
                  │
            ┌─────┴─────┐
            │  NETLIFY  │ (sirve los archivos del directorio dist/)
            └───────────┘
```

- **Cliente 100 %**: el motor de simulación corre dentro del navegador. No hay backend, no hay API, no hay base de datos.
- **Separación motor / UI**: el motor es **JavaScript puro** sin ninguna referencia a React. Es framework-agnóstico y testeable con Node directamente. La UI (React + Bootstrap) lo consume llamando a `runSimulacion(config)` desde un event handler.
- **Stack:**
  - [React 19](https://react.dev/) — la UI declarativa.
  - [Vite 8](https://vitejs.dev/) — el bundler / dev server.
  - [React-Bootstrap 2](https://react-bootstrap.netlify.app/) + Bootstrap 5 — componentes visuales.
  - [Chart.js 4](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) — gráficos (donuts, barras, líneas, histograma).
  - [Vitest 4](https://vitest.dev/) — runner de tests del motor.
  - React Compiler activo (memoización automática).

---

## 7. Estructura del proyecto (archivos)

```
PF-G04-4K3-PF-Frontend/
├── public/                       Assets estáticos (favicon, íconos)
├── src/
│   ├── App.jsx                   Componente raíz: orquesta toda la página
│   ├── main.jsx                  Punto de entrada de React
│   ├── App.css, index.css        Estilos globales + tema oscuro
│   │
│   ├── engine/                   ◀── EL MOTOR DE SIMULACIÓN (JS puro)
│   │   ├── constants.js          Parámetros por defecto del modelo
│   │   ├── rng.js                Generador congruencial mixto (con BigInt)
│   │   ├── distributions.js      Uniforme, Normal, Poisson, etc.
│   │   ├── simulation.js         Orquestador: runSimulacion(config)
│   │   └── __tests__/            21 tests de Vitest
│   │
│   ├── hooks/
│   │   └── useSimulacion.js      Conecta el motor con React
│   │                              (estado idle | running | done | error)
│   │
│   └── components/
│       ├── common/Principal.jsx          Encabezado de bienvenida
│       ├── common/SpinnerCustom.jsx      Spinner de carga
│       ├── Footer.jsx                    Pie de página
│       ├── Modelo.jsx                    Diagrama conceptual del sistema
│       ├── EntradasSimulador.jsx         ◀── FORMULARIO DE PARÁMETROS
│       └── resultados/                   ◀── LAS CINCO VENTANAS
│           ├── ResultadosTabs.jsx        Contenedor con pestañas
│           ├── ResumenMensual.jsx        Pestaña 1 (tarjetas + donuts + línea)
│           ├── DesgloseDiario.jsx        Pestaña 2 (barras apiladas + tabla)
│           ├── GrillaEquipos.jsx         Pestaña 3 (vector de estado)
│           ├── Decisiones.jsx            Pestaña 4 (3 tarjetas IF/THEN)
│           ├── GlosarioVariables.jsx     Panel lateral con las siglas
│           ├── format.js                 Helpers de formato es-AR
│           └── graficos/                 ◀── GRÁFICOS (chart.js)
│               ├── chartSetup.js         Registro de chart.js + defaults dark
│               ├── ChartCard.jsx         Wrapper común (tarjeta + título)
│               ├── Donuts.jsx            Donuts de distribución por tipo y destino
│               ├── EquiposPorDia.jsx     Bar chart apilado (30 días)
│               ├── AcumuladoMensual.jsx  Line chart con doble eje Y
│               └── HistogramaUniforme.jsx Pestaña 5 (histograma del RNG)
│
├── netlify.toml                  Configuración de deploy
├── package.json                  Dependencias y scripts npm
└── README.md                     Este archivo
```

---

## 8. Cómo correrlo

**Requisitos:** [Node.js](https://nodejs.org/) 20 o superior. No se necesita ninguna otra herramienta ni base de datos.

```bash
# 1. Instalar dependencias (la primera vez, ~1 min)
npm install

# 2. Levantar el servidor de desarrollo
#    Vite imprime una URL como http://localhost:5173/
npm run dev

# 3. Correr los tests del motor (21 tests, ~5 segundos)
npm test

# 4. Construir el bundle de producción (queda en dist/)
npm run build

# 5. Previsualizar el bundle de producción en local
npm run preview
```

Todos los comandos se corren parados en el directorio raíz del proyecto.

---

## 9. Cómo usar la interfaz

Al abrir `http://localhost:5173/` se ve una sola página dividida en bloques apilados:

1. **Encabezado** — título del trabajo y comisión.

2. **Modelo del Sistema** — diagrama conceptual del flujo (Llegadas → Cola Recepción → Recepción → Cola Procesam. → Procesador 1/2 → Completados). *Es ilustrativo; los números no salen de la simulación.*

3. **Configuración de la Simulación** — formulario con los parámetros editables:
   - **General**: semilla, días a simular. (El generador siempre es Congruencial Mixto.)
   - **Llegada de lotes**: λ (lotes/día), base y amplitud de la cantidad de equipos por lote.
   - **Parámetros avanzados** (botón "Mostrar parámetros avanzados"): cortes de las distribuciones discretas, parámetros de las distribuciones continuas, litros de agua por tipo, umbrales de decisión, y constantes del generador (`a`, `c`, `m`, en solo lectura).

4. **Botones**:
   - **▶ Ejecutar Simulación** — corre el motor con la configuración actual.
   - **↺ Reiniciar** — vuelve los parámetros a los valores por defecto.

5. **Resultados de la Simulación** — aparece solo después de ejecutar.

Mientras la simulación corre, el botón Ejecutar muestra un spinner.

---

## 10. Las cinco ventanas de resultados

El bloque de resultados muestra cinco pestañas y, al costado, un **glosario sticky** con todas las siglas del modelo (no hace falta acordarse de memoria qué es cada una).

### Pestaña 1 — Resumen mensual

Combina **tres bloques** que se leen de arriba hacia abajo:

1. **Donuts de distribuciones empíricas** (dos gráficos de torta): distribución por tipo de equipo (Servidor / Switch/Router / Hogareño) y por destino del diagnóstico (Reutilización / Desarme / Disposición). Al costado de cada donut se aclara la proporción teórica del modelo, así se puede comparar visualmente si la corrida respetó las probabilidades.
2. **Tarjetas con los acumulados del mes**, agrupadas en:
   - **Producción**: TEP, CS, CR, ER, PT.
   - **Destinos del diagnóstico**: EF, ED, EI.
   - **Impacto ambiental y calidad**: TA (litros de agua), PE (incidentes).
   - **Tiempos acumulados**: TTR, TTD, TTDD, TT (todos en horas).
3. **Line chart "Evolución acumulada"**: dos curvas con doble eje Y mostrando cómo crecen, día a día, los equipos procesados (TEP, eje izquierdo) y los litros de agua no contaminada (eje derecho).

### Pestaña 2 — Desglose diario

Arriba, un **bar chart apilado** con 30 barras (una por día), desglosadas por tipo de equipo. Permite "ver" la variabilidad de la Poisson(λ=6): algunos días caen más lotes que otros.

Debajo, una **tabla de 30 filas** con cantidad de lotes, equipos totales, equipos por tipo, peso del día, destinos, incidentes y litros de agua. Al pie hay una fila "Total" que valida la consistencia con el resumen.

### Pestaña 3 — Grilla de eventos

Es el **"vector de estado"**: una fila por equipo procesado (~1.800 con semilla 2.000), con columnas para cada `u` consumido y el valor que produjo. Las columnas son:

| Col       | Qué muestra                                       |
| --------- | ------------------------------------------------- |
| `#`       | Índice global del equipo                          |
| Día, Lote, Eq. | Coordenadas dentro del recorrido             |
| `u·Tipo`, Tipo | RND y tipo resultante (Servidor / Switch / Hogareño) |
| `u·Peso`, Peso | RND y peso en kg                             |
| `u·TR₁`, `u·TR₂`, TR | Los dos RND de Box-Muller y el tiempo de recepción |
| `u·TD`, TD     | RND y tiempo de diagnóstico                  |
| `u·Dest.`, Destino | RND y destino (Reutilización / Desarme / Disposición) |
| `u·TDD`, TDD   | RND y tiempo de desarme (vacío si no fue a desarme) |
| `u·Efic.`, Resultado | RND y si fue OK o Incidente            |
| Agua      | Litros sumados por este equipo                    |

Como son muchas filas, la pestaña tiene controles de **"Mostrar desde fila X / Cantidad N"** + botones Anterior/Siguiente. La tabla es ancha y se desliza horizontalmente.

### Pestaña 4 — Decisiones

Tres tarjetas, una por cada alternativa de decisión del modelo. Cada tarjeta muestra: la **condición** (ej.: `TT > 160 h`), el **valor real obtenido**, si **cumple** la condición (badge verde) o no (badge gris), y la **recomendación textual**.

### Pestaña 5 — Generador

Pestaña dedicada a **validar la calidad del generador pseudoaleatorio**. Muestra:

- **Histograma** de los ~14.400 números `u` que la simulación efectivamente consumió, agrupados en 10 deciles (`0,0–0,1` ... `0,9–1,0`). Si el generador es uniforme, todas las barras deberían acercarse a la **línea punteada de frecuencia esperada** que se dibuja encima.
- **Panel de estadísticas** al costado: cantidad de muestras, media muestral, media esperada (0,5), mínimo y máximo observados, frecuencia esperada por decil y desvío máximo respecto del esperado.

Esta vista funciona como una **prueba estadística visual** del Congruencial Mixto sembrado y deja preparado el terreno para los tests formales de la *Clase 2 – Pruebas Estadísticas* (chi-cuadrado, Kolmogorov–Smirnov, etc.) que vienen más adelante.

---

## 11. Las tres decisiones automáticas del modelo

Al final de los 30 días, el software evalúa tres condiciones del diagrama y emite una recomendación por cada una:

| Condición            | Si se cumple → recomendación                              | Si no se cumple → recomendación              |
| -------------------- | --------------------------------------------------------- | -------------------------------------------- |
| `TT > 160 h`         | Invertir en un nuevo operario                             | Sin inversiones                              |
| `TTR > 160 h`        | Invertir en un nuevo Recepcionista                        | Sin inversiones                              |
| `TEP > 800 equipos`  | Habilitar un segundo turno o buscar un convenio           | La operación en un único turno es suficiente |

> Las tres son configurables desde *Parámetros avanzados* (panel "Umbrales de decisión").

**Comportamiento esperado con los valores por defecto:** como el modelo procesa miles de equipos en 30 días, `TT` (suma de diagnóstico + desarme) y `TEP` casi siempre cruzan sus umbrales, mientras que `TTR` queda por debajo. Esto no es un error: refleja que la línea de procesamiento está saturada pero la recepción no.

---

## 12. Tests del motor

[Vitest](https://vitest.dev/) corre tres archivos de tests sobre [src/engine/](src/engine/), sin tocar React (el motor es JS puro):

| Archivo                                    | Verifica                                                |
| ------------------------------------------ | ------------------------------------------------------- |
| `__tests__/rng.test.js`                    | Reproducibilidad, rango `[0,1)`, precisión BigInt, Hull-Dobell |
| `__tests__/distributions.test.js`          | Medias y desvíos de cada distribución dentro de tolerancia |
| `__tests__/simulation.test.js`             | Determinismo, invariantes (`TEP = CS+CR+ER`, etc.), límites exactos de las decisiones |

Total: **21 tests**. Se ejecutan con `npm test` (~5 segundos).

---

## 13. Deploy en Netlify

El proyecto está configurado para **deploy estático** sin servidor.

[netlify.toml](netlify.toml) le indica a Netlify:

```toml
[build]
  command = "npm run build"   # genera el directorio dist/
  publish = "dist"            # ese directorio se sirve como sitio estático
[build.environment]
  NODE_VERSION = "20"
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200                # SPA fallback
```

Pasos para publicar:

1. Subir el repo a GitHub (o GitLab/Bitbucket).
2. En Netlify, *New site from Git* → elegir el repo.
3. Netlify detecta `netlify.toml` automáticamente, corre `npm run build` y publica el directorio `dist/`.
4. Cada `git push` redeploya en segundos.

No hace falta configurar variables de entorno ni nada más; toda la "lógica del backend" vive en el JavaScript que se descarga al navegador.

---

## 14. Notas y limitaciones conocidas

- **El software sigue literalmente el diagrama de flujo del grupo**, no el modelo verbal donde difiere. Por eso:
  - El peso usa una **misma fórmula para los tres tipos** (`0,5 + 19,5·u`), aunque en la realidad un servidor pesa mucho más que un router hogareño.
  - No se calcula recuperación de materiales (oro, platino, cobre, hierro) ni la decisión sobre invertir en una trituradora — el diagrama no las incluye.
  - `INT(5 + 10·u)` arroja enteros de **5 a 14**; el 15 es inalcanzable porque `u < 1`. Es literal del diagrama.
- El bloque **"Modelo del Sistema"** del encabezado tiene números ilustrativos hardcodeados; no salen de la simulación.
- El motor también tiene implementadas, por completitud, una distribución exponencial y un generador multiplicativo, pero **la UI solo expone Poisson + Mixto**.
- Con la semilla `2000` y los parámetros por defecto: `TEP ≈ 1.808 equipos`, `TA ≈ 36.322.000 L`, `TT ≈ 905 h`. Estos valores se reproducen exactamente en cualquier máquina.

---

**Equipo G04 — Comisión 4K3**
Trabajo Final Integrador · Cátedra de Simulación · UTN-FRT
