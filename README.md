# OT UNDER ATTACK

Simulador interactivo de ciberseguridad industrial para la exposición de Tecnologías para la Automatización — Ingeniería en Sistemas de Información, UTN FRBA.

La experiencia propone cinco decisiones frente a incidentes de OT/IT. El estado de una planta industrial ficticia evoluciona con cada respuesta: seguridad, producción, sistemas comprometidos, zonas de red y eventos operativos. Los indicadores son didácticos y no representan probabilidades ni mediciones industriales reales.

## Stack

- React + TypeScript + Vite
- Framer Motion para transiciones
- Lucide React para iconos
- Tailwind CSS para layout, responsive, tokens y estados de componentes
- CSS visual dedicado con SVG para la planta, conexiones y animaciones especiales
- i18next + react-i18next para español e inglés, con preferencia persistida localmente
- Vitest para el motor de consecuencias

No hay backend, base de datos, autenticación ni servicios externos requeridos para jugar. El sonido usa Web Audio API y comienza desactivado.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Comandos disponibles:

```bash
npm run build      # typecheck + build de producción
npm run test       # pruebas del motor de simulación
npm run lint       # ESLint
npm run format     # Formatear el proyecto con Prettier
npm run format:check # Verificar formato sin modificar archivos
npm run preview    # servir dist localmente
```

## GitHub Pages

El workflow `.github/workflows/ci.yml` valida formato, lint, tests y build en cada Pull Request y en `main`. El workflow `.github/workflows/deploy.yml` publica `dist` en GitHub Pages únicamente después de un CI exitoso en `main`. En la configuración del repositorio, activar Pages con **GitHub Actions** como fuente.

Dependabot revisa semanalmente las dependencias de npm. La versión de Node esperada está definida en `.nvmrc` y en `package.json`. El deploy verifica que el artefacto incluya `index.html` y el favicon antes de publicarlo.

Vite usa `/` por defecto en desarrollo. Para un subpath explícito se puede compilar con:

```bash
VITE_BASE_PATH=/nombre-del-repositorio/ npm run build
```

## Mecánica

Cada escenario tiene tres alternativas y una decisión recomendada. El orden de las alternativas se mezcla al iniciar cada partida para evitar patrones predecibles; la evaluación usa el identificador interno de cada opción. El motor aplica consecuencias acumulativas, ajusta valores acotados entre 0 y 100 y actualiza las zonas de la planta. Las salidas posibles son `INCIDENTE CONTROLADO`, `PLANTA EN CONTINGENCIA` y `GAME OVER`. Un error aislado no termina la partida automáticamente.

Los escenarios están inspirados en conceptos de segmentación OT/IT, Modbus TCP heredado, Triton/SIS, ransomware y el problema del oráculo en blockchain. Las referencias históricas se distinguen de los valores inventados del videojuego.

Las convenciones de animación y las reglas para futuras contribuciones están documentadas en [`docs/ANIMATIONS.md`](docs/ANIMATIONS.md). El motor conserva el orden real de los escenarios mezclados y registra eventos estructurados; la consola los traduce y presenta al usuario.

## Estructura

```text
src/
  data/scenarios.ts          contenido pedagógico
  engine/simulationEngine.ts estado y consecuencias
  constants/domain.ts          estados, zonas, eventos y configuración
  components/                planta, consola, topbar e indicadores
  screens/                   bienvenida, simulación y resultados
  hooks/                     estado de partida y sonido
  i18n/locales/              textos ES/EN y configuración de i18next
  styles/visuals.css         identidad visual, responsive, SVG y animaciones
  styles/console.css         consola de decisiones y layout fijo
  styles/tailwind.css        utilidades Tailwind y tokens de componentes
  utils/                     formateo de eventos, resultados y utilidades puras
.github/workflows/deploy.yml despliegue estático
```

La planta es una representación didáctica ficticia: no reproduce una instalación real, no emite comandos industriales y no afirma que un incidente informático produzca automáticamente daño físico.
