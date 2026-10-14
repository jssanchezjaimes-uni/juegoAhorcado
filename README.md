# El Ahorcado Móvil

Juego de palabras colombianas desarrollado con React Native y Expo. El proyecto incluye una aplicación móvil para Expo Go y una vista web con Vite, ambas con el diseño del juego.

**Autor:** Joan Sanchez

## Enlaces

- **Video de presentación:** [Ver el video en Google Drive](https://drive.google.com/file/d/1rnKqnJl98IUpc0lMzEJJ45wjqTE7Styb/view?usp=sharing)
- **Diseño en Figma:** [Abrir el diseño de El Ahorcado Móvil](https://www.figma.com/make/q1cVSUZoPzjtx0pOwCbFPz/Dise%C3%B1o-UI-El-Ahorcado-M%C3%B3vil?t=grWWGBDyys09bNFM-1)
- **Licencia:** [MIT](LICENSE)

## Diseño y capturas

Los archivos visuales están organizados en `docs/`: `diseno/` reúne las pantallas exportadas del diseño original de Figma y `capturas-expo/` contiene imágenes de la app ejecutándose en Expo Go.

**Diseño original**

![Pantalla de inicio del diseño en Figma](docs/diseno/inicio.png)

Ver todas las pantallas del [diseño](docs/diseno/): [inicio](docs/diseno/inicio.png), [instrucciones](docs/diseno/instrucciones.png), [categoría y dificultad](docs/diseno/categoria-dificultad.png), [juego](docs/diseno/juego.png), [victoria](docs/diseno/victoria.png), [derrota](docs/diseno/derrota.png), [estadísticas](docs/diseno/estadisticas.png), [configuración](docs/diseno/configuracion.png) y [tema oscuro](docs/diseno/tema-oscuro.png).

**Aplicación en Expo Go**

![Pantalla de inicio de la app en Expo Go](docs/capturas-expo/inicio.jpg)

Ver las [capturas del juego en Expo Go](docs/capturas-expo/): [inicio](docs/capturas-expo/inicio.jpg), [instrucciones](docs/capturas-expo/instrucciones.jpg), [categoría y dificultad](docs/capturas-expo/categoria-dificultad.jpg), [partida](docs/capturas-expo/juego-derrota.jpg), [victoria durante el juego](docs/capturas-expo/juego-victoria.jpg), [resultado de victoria](docs/capturas-expo/resultado-victoria.jpg), [resultado de derrota](docs/capturas-expo/resultado-derrota.jpg), [estadísticas](docs/capturas-expo/estadisticas.jpg), [configuración clara](docs/capturas-expo/configuracion-clara.jpg) y [configuración oscura](docs/capturas-expo/configuracion-tema-oscuro.jpg).

## Estructura del repositorio

```text
el-ahorcado-movil/
├── .figma/
│   └── make/site.json                # Configuración usada por Vite para la vista web
├── .gitignore                        # Excluye dependencias, cachés y builds locales
├── .mise.toml                        # Versiones de Node.js y pnpm
├── LICENSE                           # Licencia MIT
├── assets/
│   ├── icon.png                      # Ícono de la aplicación
│   ├── splash.png                    # Imagen de carga de Expo
│   └── sonidos/                      # Efectos de acierto, error, victoria y derrota
├── docs/
│   ├── diseno/                       # Mockups exportados de Figma y su índice
│   └── capturas-expo/                # Capturas de la app en Expo Go y su índice
├── src/
│   ├── components/                   # Componentes reutilizables de la interfaz
│   │   ├── Ahorcado.js               # Dibujo SVG progresivo
│   │   ├── Marcador.js               # Vidas, puntos y cronómetro
│   │   ├── ModalResultado.js         # Resumen al ganar o perder
│   │   ├── PalabraOculta.js          # Letras reveladas y espacios
│   │   ├── Teclado.js                # Teclado de letras, incluida la Ñ
│   │   └── UI.js                     # Pantalla, encabezado y botones comunes
│   ├── data/
│   │   ├── palabras.js               # Banco colombiano usado por Expo
│   │   ├── palabras.ts               # Banco tipado usado por la vista web
│   │   └── palabras.d.ts             # Tipos para el módulo de palabras
│   ├── hooks/
│   │   └── useJuego.js               # Estado y reglas de una partida
│   ├── navigation/
│   │   └── AppNavigator.js           # Navegación Stack entre pantallas
│   ├── screens/                      # Pantallas de la aplicación
│   │   ├── InicioScreen.js           # Nombre y menú principal
│   │   ├── InstruccionesScreen.js    # Reglas y niveles
│   │   ├── CategoriaScreen.js        # Categoría y dificultad
│   │   ├── JuegoScreen.js            # Partida y resultado
│   │   ├── EstadisticasScreen.js     # Progreso y mejores puntajes
│   │   └── ConfiguracionScreen.js    # Preferencias y borrado de datos
│   ├── storage/
│   │   └── almacenamiento.js         # Estadísticas, ranking y preferencias locales
│   ├── theme/
│   │   ├── TemaContext.js            # Acceso compartido al tema y configuración
│   │   └── colores.js                # Paletas clara y oscura
│   ├── utils/
│   │   └── game.ts                   # Funciones auxiliares de la versión web
│   ├── App.tsx                       # Interfaz web basada en React y Vite
│   ├── index.css                     # Estilos globales web
│   ├── main.tsx                      # Entrada de la aplicación web
│   └── vite-env.d.ts                 # Tipos de entorno para Vite
├── App.js                            # Proveedor de tema y raíz de Expo
├── app.json                          # Configuración de Expo, ícono y splash
├── index.js                          # Registra la aplicación nativa en Expo
├── index.html                        # Documento de inicio para Vite
├── package.json                      # Dependencias y comandos del proyecto
├── pnpm-lock.yaml                    # Versiones exactas de dependencias
├── pnpm-workspace.yaml               # Ajustes del workspace pnpm
├── tsconfig.json                     # Configuración de TypeScript
├── vite.config.ts                    # Configuración del servidor y build web
└── README.md
```

## Cómo jugar

1. Escribe tu nombre en la pantalla de inicio y pulsa **Jugar**.
2. Selecciona una categoría o **Aleatoria**, y elige la dificultad.
3. Adivina la palabra pulsando letras del teclado. Los espacios de palabras compuestas aparecen desde el principio; las tildes no cuentan como letras distintas y la **Ñ** sí se diferencia de la **N**.
4. Cada letra incorrecta añade una parte al dibujo. Tienes seis vidas; en nivel difícil también tienes 90 segundos.
5. Usa las pistas disponibles cuando las necesites. Una pista muestra una descripción y la siguiente puede revelar una letra.
6. Al terminar, revisa el puntaje y vuelve al menú o inicia otra partida.

### Dificultades y puntaje

| Nivel   | Palabras        | Pistas  | Tiempo      | Multiplicador |
| ------- | --------------- | ------- | ----------- | ------------- |
| Fácil   | 4 a 6 letras    | 2       | Sin límite  | ×1            |
| Medio   | 7 a 9 letras    | 1       | Sin límite  | ×2            |
| Difícil | 10 o más letras | Ninguna | 90 segundos | ×3            |

- Letra correcta: **+10 puntos por cada aparición**.
- Letra incorrecta: **−5 puntos**.
- Usar una pista: **−15 puntos**.
- Ganar: **+50 puntos y 10 por cada vida restante**.
- Al final, el subtotal se multiplica según la dificultad.

## Requisitos

- Node.js 22 o posterior.
- pnpm instalado.
- Para móvil: Expo Go en el teléfono y ambos dispositivos en la misma red, o un emulador.

## Instalar y ejecutar en Expo Go

Desde la raíz del repositorio:

```bash
pnpm install
pnpm start
```

Abre Expo Go y escanea el QR mostrado por Expo. Si los dispositivos no se encuentran en la red local, puedes iniciar el modo túnel con `pnpm start --tunnel`.

Comandos opcionales:

```bash
pnpm android       # Inicia Expo e intenta abrir un emulador Android
pnpm ios           # Inicia Expo para un simulador iOS en macOS
```

## Ejecutar la versión web

La vista web conserva el diseño para navegador y se ejecuta con Vite:

```bash
pnpm install
pnpm run web
```

Para generar una versión web optimizada y previsualizarla:

```bash
pnpm run build:web
pnpm run preview
```

## Datos locales y uso sin conexión

El banco de palabras, los sonidos y las imágenes están incluidos en el proyecto. Las estadísticas, el Top 10 y las preferencias se guardan en el dispositivo con AsyncStorage. Una vez cargada la aplicación, las partidas no requieren conexión a internet.
