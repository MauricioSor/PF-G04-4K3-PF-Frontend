# ♻️ Simulador Nave Tierra — Reciclaje de RAEE

**Frontend del Trabajo Final Integrador (TFI) · Grupo G04 · 4K3 · UTN-FRT**
Simulación de eventos discretos de una planta de reciclaje de residuos electrónicos en San Miguel de Tucumán.

> Aplicación web que **simula el funcionamiento de una planta de reciclaje** durante un mes y muestra, con gráficos y tablas, cuántos equipos se procesan, cuánto material se recupera, cuánta agua se evita contaminar y qué decisiones de gestión conviene tomar.

---

## 📑 Tabla de contenidos

1. [Para todo público: ¿qué es esto?](#-para-todo-público-qué-es-esto)
2. [El modelo: cómo "funciona" la planta simulada](#-el-modelo-cómo-funciona-la-planta-simulada)
3. [El motor de azar: números aleatorios](#-el-motor-de-azar-números-aleatorios)
4. [Cómo usar la aplicación, paso a paso](#️-cómo-usar-la-aplicación-paso-a-paso)
5. [Cómo leer los resultados](#-cómo-leer-los-resultados)
6. [Glosario de variables](#-glosario-de-variables)
7. [Para técnicos: arquitectura y stack](#️-para-técnicos-arquitectura-y-stack)
8. [Estructura del proyecto](#-estructura-del-proyecto)
9. [Principales funciones y métodos](#-principales-funciones-y-métodos)
10. [Contrato con la API (backend)](#-contrato-con-la-api-backend)
11. [Instalación y ejecución](#-instalación-y-ejecución)
12. [Build y despliegue](#-build-y-despliegue)
13. [Preguntas frecuentes](#-preguntas-frecuentes)
14. [Créditos](#-créditos)

---

## 🌎 Para todo público: ¿qué es esto?

### El problema del mundo real

Los **RAEE** (Residuos de Aparatos Eléctricos y Electrónicos) — computadoras, servidores, routers, switches y equipos de red viejos — son uno de los tipos de basura que más rápido crece en el mundo. Si se tiran mal, contaminan el suelo y el agua. Si se reciclan bien, se recupera material valioso y se **evita contaminar miles de litros de agua**.

**Nave Tierra** es una planta (modelo) que recibe estos equipos, los revisa y decide qué hacer con cada uno: reutilizarlo, desarmarlo para recuperar piezas, o descartarlo.

### ¿Qué hace este software?

No es la planta real: es un **simulador**. Imita lo que pasaría en la planta durante **30 días laborables** (8 horas por día) usando matemática y azar controlado, sin tener que esperar un mes real ni gastar recursos.

Pensalo como un "videojuego de gestión" que en lugar de jugarse, se *calcula*: el programa genera llegadas de equipos al azar (pero siguiendo patrones realistas), los procesa uno por uno y al final te entrega un **tablero con estadísticas y recomendaciones**.

### ¿Para qué sirve?

- 📊 **Estimar capacidad**: ¿cuántos equipos puede procesar la planta en un mes?
- 💧 **Medir impacto ambiental**: ¿cuántos litros de agua se evita contaminar?
- ⚖️ **Cuantificar material**: ¿cuántas toneladas se recuperan?
- 🧑‍🔧 **Tomar decisiones de gestión**: ¿hace falta contratar más personal o abrir un segundo turno?
- 🎲 **Validar el azar**: comprobar que el generador de números aleatorios es "justo" (uniforme).

### ¿Por qué simular en vez de medir la planta real?

Porque es **barato, rápido y seguro**. Podés probar muchos escenarios ("¿y si llegan más equipos?", "¿y si cambio un parámetro?") sin riesgo, y como el azar es **reproducible** (ver más abajo), dos personas que usen la misma configuración obtienen exactamente el mismo resultado — algo clave para un trabajo académico.

---

## 🏭 El modelo: cómo "funciona" la planta simulada

La planta se modela como una **línea de proceso** por la que pasa cada equipo, de principio a fin:

```
  🚚 Llegadas  →  ⏳ Cola      →  🧑‍💼 Recepción  →  ⏳ Cola        →  ⚙️ Diagnóstico  →  ✅ Destino final
   de lotes       Recepción       (revisión)        Diagnóstico       y Desarme         (3 caminos)
```

Paso a paso, lo que ocurre con cada equipo:

### 1️⃣ Llegan los lotes de equipos
Los camiones llegan en **lotes**, en momentos al azar. El tiempo entre una llegada y la siguiente sigue una distribución **Exponencial con media de 80 minutos** (≈ 6 lotes por día). Cada lote trae entre **5 y 14 equipos** (distribución uniforme).

### 2️⃣ Cada equipo es de un tipo
Al entrar, se sortea qué tipo de equipo es:

| Tipo | Equipo | Probabilidad |
|------|--------|:---:|
| 🖥️ Tipo 1 | Servidor (Rack/Blade) | 25 % |
| 🌐 Tipo 2 | Switch / Router industrial | 45 % |
| 💻 Tipo 3 | Equipo de red hogareño | 30 % |

Cada equipo además tiene un **peso** sorteado al azar (cada tipo en su rango).

### 3️⃣ Recepción
Un recepcionista registra cada equipo. El tiempo de recepción sigue una distribución **Normal (media 2 min, desvío 0,5)**. Hay **1 recepcionista** y la cola se atiende por orden de llegada (**FIFO**: el primero que llega es el primero en ser atendido).

### 4️⃣ Diagnóstico y decisión de destino
Se diagnostica cada equipo (**Uniforme entre 3 y 12 min**) y se decide su destino:

| Destino | Sigla | Qué significa | Proporción |
|---------|:---:|---------------|:---:|
| ♻️ Reutilización | **EF** | El equipo funciona → se reutiliza | ~10 % |
| 🔧 Desarme | **ED** | Se desarma para recuperar piezas/materiales | ~75 % |
| 🗑️ Disposición | **EI** | Irrecuperable → disposición final | ~15 % |

Los equipos que van a desarme suman un tiempo extra de **desarme (Uniforme entre 5 y 55 min)**.

### 5️⃣ Control de calidad e impacto ambiental
Cada procesamiento puede salir **correcto (99,05 %)** o terminar en un **incidente de contaminación (0,95 %)**. Cuando sale correcto, se contabiliza el **agua que se evitó contaminar**, según el tipo de equipo:

| Equipo | Agua evitada por equipo |
|--------|:---:|
| 🖥️ Servidor | 50.000 L |
| 🌐 Switch/Router | 15.000 L |
| 💻 Hogareño | 3.000 L |

### 6️⃣ Decisiones de gestión (lógica "si… entonces…")
Al terminar el mes, el modelo evalúa tres reglas para recomendar acciones:

| Si se cumple… | Entonces se recomienda… |
|---------------|--------------------------|
| **TTR > 160 hs** (tiempo total de recepción) | Incorporar un nuevo recepcionista |
| **TT > 160 hs** (tiempo operativo total) | Incorporar un nuevo operario |
| **TEP > 800 equipos** (total procesado) | Habilitar un segundo turno o convenio |

> 🧮 **Nota sobre los parámetros:** todos estos valores (distribuciones, probabilidades, umbrales) son **parámetros fijos del modelo** y viven en el **servidor de simulación** (backend). La aplicación web los muestra como referencia, pero para modificarlos hay que actualizar la configuración del servidor.

### Las 9 distribuciones de probabilidad del modelo

Cada fuente de azar se modela con una fórmula matemática. `u` es un número aleatorio entre 0 y 1:

| # | Variable | Distribución | Fórmula |
|:-:|----------|--------------|---------|
| 1 | Tiempo entre arribos de lotes | Exponencial | `T = −80 · ln(u)` |
| 2 | Equipos por lote | Uniforme entera | `CE = INT[5 + 10·u]` |
| 3 | Tipo de dispositivo | Tabla (acumulada) | Serv ≤ 0,25 / Sw ≤ 0,70 / resto Hogareño |
| 4 | Peso del dispositivo | Uniforme | `P = 0,5 + 19,5·u` |
| 5 | Tiempo de recepción | Normal | `Normal(μ=2, σ=0,5)` |
| 6 | Destino del equipo | Tabla (acumulada) | EF ≤ 0,10 / ED ≤ 0,85 / resto EI |
| 7 | Tiempo de diagnóstico | Uniforme | `TD = 3 + 9·u` |
| 8 | Tiempo de desarme | Uniforme | `TDD = 5 + 50·u` |
| 9 | Eficacia del proceso | Tabla (acumulada) | OK ≤ 0,9905 / resto incidente |

> La distribución **Normal** se genera con el método de **Box-Muller**, que consume **dos** números aleatorios `u` por cada valor (por eso en la grilla verás `u·TR₁` y `u·TR₂`).

---

## 🎲 El motor de azar: números aleatorios

Una simulación necesita "tirar los dados" miles de veces. Pero las computadoras no saben generar azar verdadero: generan **números pseudoaleatorios** mediante una fórmula. Este proyecto usa el método clásico:

### Generador Congruencial Mixto (LCG)

```
Xₙ₊₁ = ( a · Xₙ + c ) mod m
Uₙ   = Xₙ / m
```

Donde el usuario configura:

| Parámetro | Nombre | Rol | Ejemplo |
|:---:|--------|-----|---------|
| `a` | Multiplicador | Factor multiplicativo del generador | 1664525 |
| `c` | Incremento | Constante aditiva (debe ser ≠ 0) | 1013904223 |
| `m` | Módulo | Tamaño del "espacio de estados" | 4294967296 (= 2³²) |
| `X₀` | Semilla | Valor inicial (`0 ≤ X₀ < m`) | configurable |

Cada `Xₙ` se divide por `m` para obtener un número `Uₙ` entre 0 y 1, que alimenta las distribuciones de arriba.

### 🔁 Reproducibilidad: la clave del trabajo académico

La **semilla** (`X₀`) es el punto de partida. **Misma semilla + mismos parámetros = exactamente los mismos resultados**, siempre. Esto permite:
- Repetir un experimento y verificar que da igual.
- Que el profesor reproduzca exactamente lo que vio el alumno.
- Comparar escenarios cambiando un solo parámetro y aislando su efecto.

Si dejás el campo **Semilla vacío**, la app genera una **semilla aleatoria** automáticamente (entre 1000 y 100000) y te la muestra en los resultados, para que puedas anotarla y reproducir esa corrida después.

### ✅ Validación del generador

Un buen generador debe ser **uniforme**: todos los valores entre 0 y 1 deben salir con la misma frecuencia. La pestaña **"Generador"** dibuja un histograma de los `u` realmente consumidos, agrupados en 10 deciles (0–0,1, 0,1–0,2, …). Si las barras se acercan a la línea de "frecuencia esperada" y la media muestral está cerca de **0,5**, el generador es confiable.

> 💡 Para período máximo del LCG conviene que: `mcd(c, m) = 1`; que `a − 1` sea divisible por todos los factores primos de `m`; y si `4 | m`, entonces `4 | (a − 1)`. (Condiciones de Hull-Dobell.)

---

## 🖱️ Cómo usar la aplicación, paso a paso

La app tiene **4 secciones**, accesibles desde la barra lateral izquierda:

```
 🏠 Bienvenida  →  🔗 Modelo  →  ⚙️ Configuración  →  📊 Resultados
```

### Paso 1 · Bienvenida
Pantalla de inicio del TFI. Hacé clic en **"Comenzar"** para ir a la configuración.

### Paso 2 · Modelo (opcional, recomendado)
Muestra el **diagrama de flujo** de la planta y la **tabla de las 9 distribuciones**. Sirve para entender qué se está simulando antes de ejecutar.

### Paso 3 · Configuración
Acá preparás la corrida. Vas a ver:
- **General**: días de simulación (fijo en 30) y un resumen de los parámetros del modelo.
- **Distribución de Tipos**: probabilidades de cada tipo de equipo y destino.
- **Generador RNG**: la fórmula del Congruencial Mixto.
- **Parámetros y Semilla**: acá **ingresás los valores**:
  - **Semilla** → un número positivo, o dejala vacía para que sea aleatoria.
  - **Multiplicador `a`**, **Incremento `c`**, **Módulo `m`** → los tres son **obligatorios** y deben ser números positivos.
- **Eficacia y Ambiente**: porcentajes de éxito, litros de agua evitada y umbrales de decisión.
- **Parámetros avanzados** (botón desplegable): el detalle completo de todas las distribuciones del modelo.

Cuando todo esté completo, hacé clic en **"Ejecutar Simulación"**. Si falta un parámetro, el campo se marca en rojo con un mensaje. El botón **"Reiniciar"** limpia todo y vuelve al inicio.

> Mientras se calcula, el botón muestra *"Simulando…"*. La app le envía tu configuración al servidor, que corre la simulación y devuelve los resultados.

### Paso 4 · Resultados
Cuando termina, te lleva automáticamente al **tablero de resultados** (ver siguiente sección). Arriba a la derecha verás un distintivo con el método y la **semilla usada** (en naranja si fue aleatoria, en verde si la elegiste vos).

---

## 📊 Cómo leer los resultados

El tablero tiene **5 pestañas** y un **glosario lateral** siempre visible.

### Pestaña 1 · Resumen
La vista general de un vistazo:
- **5 indicadores clave (KPIs)**: Total de Equipos, Peso Total (en toneladas), Agua Evitada (en miles de litros), % Correcto y % Incidentes.
- **6 contadores de destino y tipo**: Funcionales (EF), Desarme (ED), Desecho (EI), Servidores (CS), Switch/Router (CR), Hogareños (ER).
- **2 gráficos de dona**: reparto por **tipo de equipo** y por **destino**.
- **Gráfico de líneas acumulado**: cómo crecen, día a día, el total de equipos procesados y el agua evitada a lo largo del mes.

### Pestaña 2 · Desglose diario
Tabla con una **fila por cada uno de los 30 días**: lotes, equipos, tipos, pesos, destinos, incidentes, agua y tiempos, con su **fila de totales**. Ideal para ver la evolución diaria en detalle.

### Pestaña 3 · Grilla de eventos
La tabla más detallada: **una fila por cada equipo procesado**, mostrando para cada variable **el número aleatorio `u` que se usó** y **el valor resultante** (tipo, peso, tiempos, destino, resultado, agua). Es el "vector de estado" completo de la simulación e incluye un paginador para recorrer miles de filas. Muestra también el total de números aleatorios consumidos.

### Pestaña 4 · Decisiones
Las **tres recomendaciones de gestión** evaluadas con la lógica *si-entonces*. Cada tarjeta indica la condición, el valor obtenido, el umbral y una recomendación en texto claro, marcada como **"CONDICIÓN CUMPLIDA"** o **"NO CUMPLIDA"**.

### Pestaña 5 · Generador
La **validación estadística del azar**: histograma de los `u` en 10 deciles contra la frecuencia esperada, más estadísticas (cantidad, media muestral, mínimo, máximo, desvío máximo). Confirma que el generador es uniforme y, por tanto, confiable.

---

## 📖 Glosario de variables

Estas siglas aparecen en las tablas y resultados (visibles también en el panel lateral de la app):

<details>
<summary><b>Control de la simulación</b></summary>

| Sigla | Significado |
|-------|-------------|
| `d` | Día simulado (1 a 30) |
| `u` | Número aleatorio uniforme (0 ≤ u < 1) |
| `L` | Cantidad de lotes que llegan en el día |
| `CE` | Cantidad de equipos por lote |
</details>

<details>
<summary><b>Tipos de equipo</b></summary>

| Sigla | Significado |
|-------|-------------|
| Tipo 1 | Servidor (Rack/Blade) |
| Tipo 2 | Switch / Router industrial |
| Tipo 3 | Equipo de red hogareño |
| `CS` | Cantidad de servidores procesados |
| `CR` | Cantidad de switch/routers procesados |
| `ER` | Cantidad de equipos hogareños procesados |
</details>

<details>
<summary><b>Pesos (kg)</b></summary>

| Sigla | Significado |
|-------|-------------|
| `PS` | Peso del servidor — Uniforme(15, 30) |
| `PR` | Peso del switch/router — Uniforme(3, 8) |
| `PER` | Peso del equipo hogareño — Normal (Box-Muller, 2 u) |
| `PT` | Peso total procesado en el período |
</details>

<details>
<summary><b>Tiempos (minutos)</b></summary>

| Sigla | Significado |
|-------|-------------|
| `TR` | Tiempo de recepción de un equipo — Normal(μ=2, σ=0,5) |
| `TD` | Tiempo de diagnóstico — Uniforme(3, 12) |
| `TDD` | Tiempo de desarme — Uniforme(5, 55) |
| `TTR` | Tiempo total de recepción acumulado |
| `TTD` | Tiempo total de diagnóstico acumulado |
| `TTDD` | Tiempo total de desarme acumulado |
| `TT` | Tiempo total operativo (TTD + TTDD) |
</details>

<details>
<summary><b>Destino del diagnóstico</b></summary>

| Sigla | Significado |
|-------|-------------|
| `EF` | Equipos funcionales — se reutilizan (~10 %) |
| `ED` | Equipos para desarme (~75 %) |
| `EI` | Equipos irrecuperables — disposición final (~15 %) |
</details>

<details>
<summary><b>Calidad e impacto ambiental</b></summary>

| Sigla | Significado |
|-------|-------------|
| `PC` | Equipos procesados correctamente (sin incidente) |
| `PE` | Incidentes de contaminación (~0,95 %) |
| `TA` | Litros de agua no contaminada (impacto evitado) |
| `TEP` | Total de equipos procesados en el período |
</details>

---

## 🛠️ Para técnicos: arquitectura y stack

### Visión general

Esta es la **capa de presentación (frontend)** de una aplicación cliente-servidor. **No contiene la lógica de simulación**: arma la configuración, la envía a una API REST y renderiza la respuesta.

```
┌──────────────────────────┐      POST /api/simulate/naveTierra        ┌──────────────────────┐
│   Frontend (este repo)    │  ─────────────────────────────────────▶  │  Backend (API REST)  │
│   React 19 + Vite 8       │     { method, seed, params:{a,c,m} }      │  Motor de simulación │
│   (Netlify)               │  ◀─────────────────────────────────────  │  (Render u otro)     │
└──────────────────────────┘      { dias, resumen, grilla, rng… }       └──────────────────────┘
```

### Stack tecnológico

| Categoría | Tecnología | Versión | Para qué |
|-----------|-----------|:---:|----------|
| Librería UI | **React** | 19 | Componentes e interfaz |
| Build tool / dev server | **Vite** | 8 | Bundling y HMR |
| Compilador | **React Compiler** (Babel) | 1.0 | Optimización automática de renders |
| Gráficos | **Chart.js** + **react-chartjs-2** | 4 / 5 | Donas, líneas, barras, histograma |
| UI / estilos base | **Bootstrap** + **react-bootstrap** | 5 / 2 | Utilidades |
| Iconos | **lucide-react** | 1.17 | Iconografía |
| Estilos propios | **CSS Modules** + CSS global | — | Tema oscuro y layout |
| Linter | **ESLint** | 10 | Calidad de código |
| Hosting | **Netlify** | — | Despliegue del frontend (SPA) |

### Patrón de diseño

El proyecto separa estrictamente **lógica** de **presentación** mediante **custom hooks**:

- **Componentes** (`src/components/`): solo renderizan (JSX) y reciben props. Casi sin lógica.
- **Hooks** (`src/hooks/`): concentran estado, validaciones, transformación de datos y configuración de gráficos. Todo lo "pensante" vive acá.

Esto hace el código testeable, reutilizable y fácil de mantener. Por ejemplo, `useDonutsDestino` arma los datos y opciones de los gráficos de dona, y el componente `DonutsDestino` solo los dibuja.

La navegación es un **enrutador manual por estado** (no usa React Router): `useSimulacion` mantiene la vista activa (`bienvenida` → `modelo` → `configuracion` → `resultados`) y `App.jsx` renderiza la pantalla correspondiente con un `switch`.

---

## 📁 Estructura del proyecto

```
.
├── index.html                  # Punto de entrada HTML (fuentes, metadatos, #root)
├── vite.config.js              # Config de Vite + React Compiler
├── netlify.toml                # Build y fallback SPA para Netlify
├── eslint.config.js            # Reglas de ESLint
├── .env.example                # Plantilla de variables de entorno
│
├── public/                     # Assets estáticos (favicon, íconos)
│
└── src/
    ├── main.jsx                # Bootstrap de React + registro de Chart.js
    ├── App.jsx                 # Layout raíz + enrutado por estado
    ├── index.css / App.css     # Tema oscuro global y variables CSS
    │
    ├── components/
    │   ├── Sidebar/            # Barra de navegación lateral
    │   ├── Bienvenida/         # Pantalla de inicio
    │   ├── Modelo/             # Diagrama de flujo + distribuciones
    │   ├── EntradasSimulador/  # Formulario de configuración
    │   │   ├── EntradasSimulador.jsx
    │   │   └── ParametrosAvanzados.jsx
    │   └── ResultadosSimulador/
    │       ├── ResultadosSimulador.jsx   # Contenedor + pestañas
    │       ├── DonutsDestino.jsx         # Donas por tipo y destino
    │       ├── AcumuladoMensual.jsx      # Línea acumulada mensual
    │       ├── EquiposPorDia.jsx         # Barras apiladas por día
    │       ├── DesgloseDiario.jsx        # Tabla diaria
    │       ├── GrillaEventos.jsx         # Tabla equipo por equipo (vector de estado)
    │       ├── DecisionesDetalle.jsx     # Tarjetas de decisión IF-THEN
    │       ├── HistogramaGenerador.jsx   # Histograma de validación del RNG
    │       ├── GlosarioVariables.jsx     # Panel lateral de siglas
    │       └── chartSetup.js             # Registro y tema global de Chart.js
    │
    └── hooks/                  # Toda la lógica (estado + transformación de datos)
        ├── useSimulacion.js          # Vista activa + fetch a la API + estados de carga/error
        ├── useEntradasSimulador.js   # Estado del form, validación y armado del payload
        ├── useParametrosAvanzados.js # Toggle del panel avanzado
        ├── useResultados.js          # Pestañas + formateo + % OK/incidentes
        ├── useDesgloseDiario.js      # Totales del desglose diario
        ├── useGrillaEventos.js       # Paginación y formateo de la grilla
        ├── useDonutsDestino.js       # Datos/opciones de las donas
        ├── useAcumuladoMensual.js    # Datos/opciones de la línea acumulada
        ├── useEquiposPorDia.js       # Datos/opciones de barras apiladas
        ├── useHistogramaGenerador.js # Cálculo de deciles y estadísticas del RNG
        └── useGlosario.js            # Definiciones de variables del glosario
```

---

## 🔑 Principales funciones y métodos

Como toda la lógica vive en los **hooks** (`src/hooks/`), esta sección documenta las funciones más importantes de cada uno. Para quien no programa: pensá cada función como un "engranaje" que hace una tarea concreta dentro de la máquina.

### 🎛️ `useSimulacion` — orquestador principal
Controla qué pantalla se ve y la comunicación con el servidor.

| Función / valor | Qué hace |
|---|---|
| `ejecutarSimulacion(config)` | Envía la configuración al backend (`POST /simulate/naveTierra`), maneja los estados de carga y error, guarda los resultados y cambia automáticamente a la vista de Resultados. |
| `reiniciar()` | Borra resultados y errores, y vuelve a la pantalla de Configuración. |
| `view` / `setView(vista)` | Vista activa actual (`bienvenida`, `modelo`, `configuracion`, `resultados`) y la función para cambiarla. |
| `cargando` / `error` | Banderas de estado: si la simulación está corriendo y si hubo un error de conexión o del servidor. |

### 📝 `useEntradasSimulador` — formulario y validación
Maneja los datos que ingresa el usuario y construye lo que se envía al servidor.

| Función / valor | Qué hace |
|---|---|
| `handleParamChange(key, val)` | Actualiza un parámetro del generador (`a`, `c`, `m`) y limpia su mensaje de error cuando el valor pasa a ser válido. |
| `setSemilla(val)` | Actualiza la semilla, aceptando solo números o el campo vacío. |
| `validate()` | Verifica que los tres parámetros sean números positivos; marca en rojo los que falten. Devuelve `true`/`false`. |
| `buildPayload()` | Arma el objeto JSON que se manda a la API. **Si la semilla está vacía, genera una aleatoria** (entre 1000 y 100000) y marca `seedWasRandom`. |
| `handleEjecutar()` | Valida el formulario y, si todo está correcto, dispara `ejecutarSimulacion`. |
| `isValidNumericInput(str)` | Utilidad: mientras se escribe, permite solo dígitos y un punto decimal. |

> En el formulario, la función `blockInvalidKeys(e)` (en el componente `EntradasSimulador`) refuerza lo anterior **bloqueando a nivel de teclado** cualquier tecla que no sea un número, para impedir entradas inválidas desde el origen.

### 📊 `useResultados` — tablero de resultados
Controla las pestañas y los cálculos generales del resumen.

| Función / valor | Qué hace |
|---|---|
| `tabActivo` / `setTabActivo(id)` | Pestaña visible (`resumen`, `desglose`, `grilla`, `decisiones`, `generador`). |
| `pctOk` / `pctIncid` | Calculan el **% de equipos correctos** y el **% de incidentes** sobre el total procesado (TEP). |
| `fmt(n, dec)` | Formatea números al estilo argentino (`es-AR`: punto de miles, coma decimal). |

### 📅 `useDesgloseDiario` — totales del mes
| Función / valor | Qué hace |
|---|---|
| `totales` | Recorre los 30 días y **suma** lotes, equipos, pesos, destinos, incidentes, agua y tiempos para construir la fila de totales. |

### 🔢 `useGrillaEventos` — tabla equipo por equipo
Maneja la paginación de la grilla, que puede tener miles de filas (una por equipo).

| Función / valor | Qué hace |
|---|---|
| `filas` | Porción visible de la grilla según la página actual (desde/cantidad). |
| `irAnterior()` / `irSiguiente()` | Navegan a la página anterior o siguiente. |
| `fmtU(v)` | Formatea un número aleatorio `u` con 4 decimales. |
| `fmt2(v)` / `fmtInt(v)` | Formatean valores con 2 decimales / como número entero. |

### 🍩 Hooks de gráficos
Cada uno transforma los datos crudos del servidor en el formato que entiende **Chart.js** (devuelven `chartData` + `opciones`):

| Hook | Qué arma |
|---|---|
| `useDonutsDestino` | Dos gráficos de dona: reparto por **tipo de equipo** (CS/CR/ER) y por **destino** (EF/ED/EI), con porcentajes en el tooltip. |
| `useAcumuladoMensual` | Gráfico de líneas de **doble eje**: acumula día a día los equipos procesados y el agua evitada. |
| `useEquiposPorDia` | Barras **apiladas** por día, separadas por tipo de equipo. |
| `useHistogramaGenerador` | Agrupa todos los `u` consumidos en **10 deciles**, calcula media, mínimo, máximo y desvío máximo, y los compara contra la frecuencia esperada (validación de uniformidad del RNG). |

### 📖 Hooks auxiliares
| Hook | Qué hace |
|---|---|
| `useGlosario` | Devuelve las definiciones de todas las siglas, agrupadas por categoría, para el panel lateral. |
| `useParametrosAvanzados` | Expone `toggle()`, que abre/cierra el panel de parámetros avanzados. |

### 🧭 Funciones de navegación (en componentes)
| Función | Archivo | Qué hace |
|---|---|---|
| `renderView()` | `App.jsx` | Decide qué pantalla mostrar según la vista activa (enrutado por estado). |
| `renderTab()` | `ResultadosSimulador.jsx` | Decide qué pestaña de resultados renderizar según la pestaña activa. |

---

## 🔌 Contrato con la API (backend)

> El backend **no está en este repositorio**. El frontend solo lo consume.

### Request

```http
POST  {VITE_API_BASE}/simulate/naveTierra
Content-Type: application/json
```

```jsonc
{
  "method": "mixedCongruential",  // único método soportado (LCG)
  "seed": 12345,                  // semilla; si fue aleatoria, la generó el front
  "seedWasRandom": false,         // true si el usuario dejó la semilla vacía
  "params": {                     // parámetros del LCG (todos > 0, obligatorios)
    "a": 1664525,
    "c": 1013904223,
    "m": 4294967296
  }
}
```

### Response (estructura esperada por el front)

```jsonc
{
  "methodName": "Congruencial Mixto (LCG)",
  "seed": 12345,
  "seedWasRandom": false,

  "resumen": {
    "TEP": 0, "PT": 0, "TA": 0, "PE": 0,
    "EF": 0, "ED": 0, "EI": 0,        // destinos
    "CS": 0, "CR": 0, "ER": 0,        // tipos
    "TTR_hs": 0, "TT_hs": 0           // tiempos en horas (para decisiones)
  },

  "dias": [                          // 30 elementos (uno por día)
    {
      "dia": 1, "lotes": 0, "equipos": 0,
      "CS": 0, "CR": 0, "ER": 0, "PT": 0,
      "EF": 0, "ED": 0, "EI": 0, "PE": 0,
      "TA": 0, "TTR": 0, "TT": 0
    }
  ],

  "grilla": [                        // una fila por equipo (vector de estado)
    {
      "idx": 1, "dia": 1, "lote": 1, "equipoEnLote": 1,
      "uTipo": 0.0, "tipoLabel": "Servidor",
      "uPeso": 0.0, "uPeso2": 0.0, "peso": 0.0,
      "uTR1": 0.0, "uTR2": 0.0, "tr": 0.0,
      "uTD": 0.0, "td": 0.0,
      "uDestino": 0.0, "destino": "EF", "destinoLabel": "Reutilización",
      "uTDD": 0.0, "tdd": 0.0,
      "uEficacia": 0.0, "ok": true, "agua": 50000
    }
  ],

  "decisiones": {                    // booleanos (umbral superado o no)
    "nuevoRecepcionista": false,
    "nuevoOperario": false,
    "segundoTurno": false
  },

  "rng": {                           // metadatos del generador
    "type": "Congruencial Mixto (LCG)",
    "seed": 12345,
    "totalUConsumidos": 0
  }
}
```

En caso de error, el backend debe responder con un status ≠ 2xx y un cuerpo `{ "error": "mensaje" }`, que el front muestra en pantalla.

---

## 🚀 Instalación y ejecución

### Requisitos previos
- **Node.js** 18 o superior (recomendado 20+)
- **npm** (incluido con Node)

### Paso a paso

```bash
# 1. Clonar el repositorio y entrar a la rama
git clone <url-del-repo>
cd <carpeta-del-repo>
git checkout dev_p

# 2. Instalar dependencias
npm install

# 3. Configurar la variable de entorno
cp .env.example .env
# Editá .env y poné la URL real de tu backend:
#   VITE_API_BASE=https://<tu-servicio>.onrender.com/api

# 4. Levantar el servidor de desarrollo
npm run dev
```

Luego abrí en el navegador la URL que muestra Vite (por defecto **http://localhost:5173**).

> ⚠️ **Sin la variable `VITE_API_BASE`**, el front intenta conectarse a `http://localhost:3001/api` (un backend local). Si no tenés backend corriendo, la simulación devolverá un error de conexión — la interfaz funciona, pero no habrá resultados.

### Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE` | URL base de la API de simulación (sin `/` final) | `https://mi-api.onrender.com/api` |

Las variables se cargan en build time con el prefijo `VITE_` (requisito de Vite). El archivo `.env` está en `.gitignore` y **no debe subirse**; `.env.example` sí, como documentación.

---

## 📦 Build y despliegue

### Scripts disponibles (`package.json`)

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente (HMR) |
| `npm run build` | Compila la app optimizada para producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción para probarlo |
| `npm run lint` | Ejecuta ESLint sobre todo el proyecto |

### Despliegue en Netlify

El repo ya incluye `netlify.toml` configurado:

```toml
[build]
  command = "npm run build"   # genera dist/
  publish = "dist"

[[redirects]]                 # fallback SPA: cualquier ruta → index.html
  from   = "/*"
  to     = "/index.html"
  status = 200
```

Pasos:
1. Conectá el repositorio en Netlify (rama `dev_p` o la que corresponda).
2. Netlify detecta `netlify.toml` automáticamente.
3. Definí la variable de entorno **`VITE_API_BASE`** en *Site settings → Environment variables*.
4. Deploy. La regla de redirect garantiza que la navegación interna funcione (SPA).

> El mismo `dist/` resultante puede servirse desde cualquier hosting estático (Vercel, GitHub Pages, S3, etc.), siempre con el fallback a `index.html`.

---

## ❓ Preguntas frecuentes

**¿Por qué la simulación no devuelve resultados?**
Casi siempre es porque `VITE_API_BASE` no apunta a un backend activo. Verificá la URL y que el servidor de simulación esté corriendo.

**¿Puedo cambiar las distribuciones, probabilidades o umbrales?**
No desde la web: son parámetros fijos del **modelo en el backend**. La app solo permite configurar el **generador** (`a`, `c`, `m`, semilla).

**¿Por qué siempre son 30 días?**
El horizonte de simulación está fijado en 30 días laborables de 8 hs, según el enunciado del TFI.

**Puse la misma semilla y mismos parámetros, ¿por qué da igual que antes?**
Es lo esperado y deseado: el generador es **determinista**. Esa reproducibilidad es una característica, no un error.

**¿Qué pasa si dejo la semilla vacía?**
El front genera una semilla aleatoria (1000–100000) y te la muestra en los resultados para que puedas reproducir esa corrida.

---

## 👥 Créditos

**Trabajo Final Integrador (TFI)** — Grupo **G04**, comisión **4K3**
**Universidad Tecnológica Nacional — Facultad Regional Tucumán (UTN-FRT)**
Caso: planta de reciclaje de RAEE **"Nave Tierra"**, San Miguel de Tucumán.

> Proyecto académico de la asignatura de Simulación. El frontend documentado aquí corresponde a la rama `dev_p`.
