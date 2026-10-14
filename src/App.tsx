import { useEffect, useMemo, useState } from "react";
import { palabras, type WordEntry } from "./data/palabras";
import { LEVEL_MULTIPLIER, normalizeLetter } from "./utils/game";

type Screen = "splash" | "home" | "setup" | "game" | "stats" | "settings";
type IconName =
  | "play"
  | "book"
  | "chart"
  | "settings"
  | "back"
  | "map"
  | "bird"
  | "fruit"
  | "food"
  | "shuffle"
  | "heart"
  | "clock"
  | "bulb"
  | "sound"
  | "vibrate"
  | "theme"
  | "trash"
  | "trophy"
  | "home"
  | "close";

const CATEGORIES = [
  { id: "capitales", label: "Capitales", detail: "de Colombia", icon: "map" as IconName },
  { id: "animales", label: "Animales", detail: "de Colombia", icon: "bird" as IconName },
  { id: "frutas", label: "Frutas", detail: "tropicales", icon: "fruit" as IconName },
  { id: "comidas", label: "Comidas", detail: "típicas", icon: "food" as IconName },
  { id: "aleatoria", label: "Aleatoria", detail: "sorpréndeme", icon: "shuffle" as IconName },
];

const KEYBOARD = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

type StoredStats = { played: number; won: number; streak: number; bestStreak: number; scores: { name: string; score: number }[] };
const EMPTY_STATS: StoredStats = { played: 0, won: 0, streak: 0, bestStreak: 0, scores: [] };
const readStats = (): StoredStats => {
  try { return { ...EMPTY_STATS, ...JSON.parse(window.localStorage.getItem("ahorcado-stats") || "{}") }; }
  catch { return EMPTY_STATS; }
};

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, React.ReactNode> = {
    play: <><path d="m8 5 11 7-11 7V5Z" /></>,
    book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" /><path d="M4 18.5A3.5 3.5 0 0 1 7.5 15H20" /></>,
    chart: <><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9c.12.4.5.99 1.55 1H21v4h-.08c-1.05.01-1.43.6-1.52 1Z" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3V6Z" /><path d="M8 3v15m8-12v15" /></>,
    bird: <><path d="M4 15c4-1 6-4 7-9 2 2 3 4 7 4l3-1-2 3c-2 4-7 7-13 6" /><path d="M8 18 6 21m5-4v4" /></>,
    fruit: <><path d="M12 8c-4-3-8-.3-8 5 0 5 3 8 8 8s8-3 8-8c0-5.3-4-8-8-5Z" /><path d="M12 8c0-3 2-5 5-5-1 3-2.5 4-5 5Z" /></>,
    food: <><path d="M3 14h18c0 4-3 7-9 7s-9-3-9-7Z" /><path d="M7 10c0-2 2-2 2-4m4 4c0-2 2-2 2-4m-4 4c0-2 2-2 2-4" /></>,
    shuffle: <><path d="M16 3h5v5m0-5-6 6c-2 2-4 2-6 0L3 3m13 18h5v-5m0 5-6-6c-2-2-4-2-6 0l-6 6" /></>,
    heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    bulb: <><path d="M9 18h6m-5 3h4m3-9a5 5 0 1 0-10 0c0 2 1 3 2 4h6c1-1 2-2 2-4Z" /></>,
    sound: <><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4c1 1 1 5 0 6m3-9c3 3 3 9 0 12" /></>,
    vibrate: <><rect x="7" y="4" width="10" height="16" rx="2" /><path d="M4 8v8M1 10v4m19-6v8m3-6v4" /></>,
    theme: <><path d="M12 3a9 9 0 1 0 9 9c0-1-.8-1.5-1.7-1.2-3.8 1.2-7.3-2.3-6.1-6.1.3-.9-.2-1.7-1.2-1.7Z" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" /></>,
    trophy: <><path d="M8 4h8v5c0 3-1 5-4 5s-4-2-4-5V4Zm0 2H4v2c0 2 1 3 4 3m8-5h4v2c0 2-1 3-4 3m-4 3v4m-4 3h8m-6-3h4" /></>,
    home: <><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function TopBar({ title, onBack, trailing }: { title: string; onBack?: () => void; trailing?: React.ReactNode }) {
  return (
    <header className="topbar">
      {onBack ? (
        <button className="icon-button topbar-action" onClick={onBack} aria-label="Volver">
          <Icon name="back" />
        </button>
      ) : <span className="topbar-spacer" />}
      <div className="topbar-title">{title}</div>
      <div className="topbar-end">{trailing}</div>
    </header>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? "logo-compact" : ""}`} aria-label="Logo de El Ahorcado Móvil">
      <div className="logo-mark">
        <span className="logo-rope" />
        <span className="logo-letter">A</span>
        <span className="flag-stripe" />
      </div>
      {!compact && (
        <div className="logo-copy">
          <span>EL AHORCADO</span>
          <strong>MÓVIL</strong>
        </div>
      )}
    </div>
  );
}

function Splash({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onContinue, 1700);
    return () => window.clearTimeout(timer);
  }, [onContinue]);

  return (
    <main className="splash" onClick={onContinue}>
      <div className="splash-pattern" aria-hidden="true">A Ñ C O L O M B I A</div>
      <div className="splash-content">
        <Logo />
        <p>Palabras que nos unen</p>
      </div>
      <div className="loader-wrap" aria-label="Cargando">
        <span className="loader" />
        <small>PREPARANDO EL JUEGO</small>
      </div>
    </main>
  );
}

function Home({ name, setName, navigate, showInstructions }: {
  name: string;
  setName: (value: string) => void;
  navigate: (screen: Screen) => void;
  showInstructions: () => void;
}) {
  const menu = [
    { label: "Jugar", icon: "play" as IconName, action: () => navigate("setup"), primary: true },
    { label: "Instrucciones", icon: "book" as IconName, action: showInstructions },
    { label: "Estadísticas", icon: "chart" as IconName, action: () => navigate("stats") },
    { label: "Configuración", icon: "settings" as IconName, action: () => navigate("settings") },
  ];

  return (
    <main className="screen home-screen">
      <section className="home-hero">
        <div className="home-topline"><Logo compact /><span>CO</span></div>
        <div className="hero-copy">
          <span className="eyebrow light">JUEGO DE PALABRAS</span>
          <h1>¿Listo para<br />el desafío?</h1>
          <p>Descubre palabras de nuestra tierra.</p>
        </div>
        <div className="hero-hills" aria-hidden="true"><span /><span /><span /></div>
      </section>
      <section className="home-panel">
        <label className="input-label" htmlFor="player-name">Tu nombre</label>
        <input
          id="player-name"
          className="name-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Escribe tu nombre para empezar"
          maxLength={18}
        />
        <div className="menu-grid">
          {menu.map((item) => (
            <button key={item.label} className={`menu-card ${item.primary ? "menu-card-primary" : ""}`} onClick={item.action}>
              <span className="menu-icon"><Icon name={item.icon} /></span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="home-footer">
          <span>HECHO POR</span>
          <strong>Joan Sanchez</strong>
        </div>
      </section>
    </main>
  );
}

function Setup({ onBack, onStart }: { onBack: () => void; onStart: (category: typeof CATEGORIES[number], difficulty: string) => void }) {
  const [selected, setSelected] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState("Medio");

  return (
    <main className="screen page">
      <TopBar title="Selecciona tu partida" onBack={onBack} />
      <div className="page-content setup-content">
        <div className="section-heading">
          <span className="step-number">1</span>
          <div><span className="eyebrow">PRIMERO</span><h2>Elige una categoría</h2></div>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              className={`category-card ${selected.id === category.id ? "selected" : ""} ${category.id === "aleatoria" ? "wide" : ""}`}
              onClick={() => setSelected(category)}
              aria-pressed={selected.id === category.id}
            >
              <span className="category-icon"><Icon name={category.icon} /></span>
              <span><strong>{category.label}</strong><small>{category.detail}</small></span>
              <span className="selection-dot" />
            </button>
          ))}
        </div>
        <div className="section-heading difficulty-heading">
          <span className="step-number">2</span>
          <div><span className="eyebrow">DESPUÉS</span><h2>Escoge la dificultad</h2></div>
        </div>
        <div className="difficulty-control">
          {["Fácil", "Medio", "Difícil"].map((level) => (
            <button key={level} className={difficulty === level ? "active" : ""} onClick={() => setDifficulty(level)}>
              {level}
            </button>
          ))}
        </div>
        <div className="difficulty-note">
          <Icon name={difficulty === "Difícil" ? "clock" : "bulb"} size={20} />
          <span>{difficulty === "Fácil" ? "Más pistas y sin límite de tiempo." : difficulty === "Difícil" ? "Menos pistas y 90 segundos para ganar." : "Una experiencia equilibrada para jugar."}</span>
        </div>
      </div>
      <div className="sticky-action">
        <button className="primary-button" onClick={() => onStart(selected, difficulty)}>
          Comenzar partida <Icon name="play" size={20} />
        </button>
      </div>
    </main>
  );
}

function Hangman({ errors }: { errors: number }) {
  return (
    <svg className="hangman" viewBox="0 0 180 150" role="img" aria-label={`Ahorcado con ${errors} de 6 errores`}>
      <path className="gallows" d="M25 136h90M48 136V15h76M48 35l20-20m56 0v22" />
      {errors >= 1 && <circle className="figure-part" cx="124" cy="50" r="13" />}
      {errors >= 2 && <path className="figure-part" d="M124 63v38" />}
      {errors >= 3 && <path className="figure-part" d="m124 73-19 16" />}
      {errors >= 4 && <path className="figure-part" d="m124 73 19 16" />}
      {errors >= 5 && <path className="figure-part" d="m124 101-17 25" />}
      {errors >= 6 && <path className="figure-part" d="m124 101 17 25" />}
      <path className="ground-accent" d="M19 136h102" />
    </svg>
  );
}

function playFeedback(isPositive: boolean, settings: { sound: boolean; vibration: boolean }) {
  if (settings.vibration && "vibrate" in navigator) navigator.vibrate(isPositive ? [25, 30, 25] : 70);
  if (settings.sound && "AudioContext" in window) {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = isPositive ? 660 : 190;
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
    oscillator.onended = () => void context.close();
  }
}

function Game({
  category,
  entry,
  difficulty,
  settings,
  onBack,
  onResult,
}: {
  category: typeof CATEGORIES[number];
  entry: WordEntry;
  difficulty: string;
  settings: { sound: boolean; vibration: boolean; dark: boolean };
  onBack: () => void;
  onResult: (won: boolean, score: number) => void;
}) {
  const [guessed, setGuessed] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [seconds, setSeconds] = useState(90);
  const letters = useMemo(() => Array.from(entry.palabra).map(normalizeLetter), [entry.palabra]);
  const errors = guessed.filter((letter) => !letters.includes(letter)).length;
  // Cada aparición acertada suma puntos, incluso si la letra se repite.
  const correctPoints = guessed.reduce(
    (total, letter) => total + letters.filter((current) => current === letter).length * 10,
    0,
  );
  const maxHints = difficulty === "Fácil" ? 2 : difficulty === "Medio" ? 1 : 0;
  const solved = letters.every((letter) => letter === " " || guessed.includes(letter));
  const score = (correctPoints - errors * 5 - hintsUsed * 15 + (solved ? 50 + (6 - errors) * 10 : 0)) * LEVEL_MULTIPLIER[difficulty];

  useEffect(() => {
    if (solved) {
      const timer = window.setTimeout(() => onResult(true, score), 350);
      return () => window.clearTimeout(timer);
    }
    if (errors >= 6) {
      const timer = window.setTimeout(() => onResult(false, score), 350);
      return () => window.clearTimeout(timer);
    }
  }, [errors, onResult, score, solved]);

  useEffect(() => {
    if (difficulty !== "Difícil" || solved || errors >= 6 || seconds === 0) return;
    const timer = window.setInterval(() => setSeconds((value) => {
      return Math.max(0, value - 1);
    }), 1000);
    return () => window.clearInterval(timer);
  }, [difficulty, errors, score, solved, seconds]);

  useEffect(() => {
    if (difficulty === "Difícil" && seconds === 0 && !solved) onResult(false, score);
  }, [difficulty, seconds, solved, score, onResult]);

  const chooseLetter = (letter: string) => {
    if (!guessed.includes(letter) && errors < 6 && !solved) {
      playFeedback(letters.includes(letter), settings);
      setGuessed((current) => [...current, letter]);
    }
  };

  const hint = () => {
    if (hintsUsed >= maxHints) return;
    const next = letters.find((letter) => letter !== " " && !guessed.includes(letter));
    if (next) { setHintsUsed((value) => value + 1); chooseLetter(next); }
  };

  return (
    <main className="screen game-screen">
      <TopBar
        title={category.label}
        onBack={onBack}
        trailing={<span className="difficulty-badge">{difficulty}</span>}
      />
      <section className="game-status">
        <div><span>VIDAS</span><strong className="lives"><Icon name="heart" size={18} /> {6 - errors}</strong></div>
        <div><span>PUNTAJE</span><strong>{score.toLocaleString("es-CO")}</strong></div>
        {difficulty === "Difícil" && <div><span>TIEMPO</span><strong className="timer"><Icon name="clock" size={17} /> 0:{String(seconds).padStart(2, "0")}</strong></div>}
      </section>
      <section className="challenge">
        <div className="game-visual">
          <Hangman errors={errors} />
          <div className="hint-card">
            <span className="eyebrow">PISTA</span>
            <p>{entry.pista}</p>
          </div>
        </div>
        <div className="word" aria-label="Palabra por descubrir">
          {letters.map((letter, index) => (
            <span key={`${letter}-${index}`} className={letter === " " ? "word-space" : guessed.includes(letter) ? "revealed" : ""}>
              {letter === " " ? " " : guessed.includes(letter) ? entry.palabra[index] : ""}
            </span>
          ))}
        </div>
        <button className="hint-button" onClick={hint} disabled={solved || errors >= 6 || hintsUsed >= maxHints || !letters.some((letter) => letter !== " " && !guessed.includes(letter))}><Icon name="bulb" size={21} /> Revelar una letra <small>(−15 pts · {maxHints - hintsUsed} disponibles)</small></button>
      </section>
      <section className="keyboard-section">
        <div className="keyboard-label"><span>ELIGE UNA LETRA</span><span>{guessed.length}/27 usadas</span></div>
        <div className="keyboard">
          {KEYBOARD.map((letter) => {
            const used = guessed.includes(letter);
            const correct = used && letters.includes(letter);
            return (
              <button
                key={letter}
                className={used ? (correct ? "key-correct" : "key-wrong") : ""}
                onClick={() => chooseLetter(letter)}
                disabled={used}
                aria-label={`Letra ${letter}${used ? correct ? ", correcta" : ", incorrecta" : ""}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function ResultModal({ won, word, score, onReplay, onMenu }: {
  won: boolean;
  word: string;
  score: number;
  onReplay: () => void;
  onMenu: () => void;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <div className="result-modal">
        <div className={`result-icon ${won ? "win" : "lose"}`}><Icon name={won ? "trophy" : "close"} size={38} /></div>
        <span className="eyebrow">{won ? "¡EXCELENTE PARTIDA!" : "SIGUE INTENTANDO"}</span>
        <h2 id="result-title">{won ? "¡Ganaste!" : "¡Perdiste!"}</h2>
        <p className="result-message">{won ? "Descubriste la palabra y sumaste un nuevo triunfo." : "Estuviste cerca. Cada letra te lleva más lejos."}</p>
        <div className="answer-card">
          <span>LA PALABRA ERA</span>
          <strong>{word}</strong>
        </div>
        <div className="final-score"><span>Puntaje final</span><strong>{score.toLocaleString("es-CO")} pts</strong></div>
        <button className="primary-button" onClick={onReplay}>Jugar de nuevo <Icon name="play" size={20} /></button>
        <button className="secondary-button" onClick={onMenu}><Icon name="home" size={20} /> Volver al menú</button>
      </div>
    </div>
  );
}

function Stats({ onBack, cleared }: { onBack: () => void; cleared: boolean }) {
  const stats = readStats();
  const summary = [["Partidas", String(stats.played)], ["Ganadas", String(stats.won)], ["Victorias", `${stats.played ? Math.round(stats.won / stats.played * 100) : 0}%`], ["Mejor racha", String(stats.bestStreak)]];
  const scores = stats.scores;

  return (
    <main className="screen page stats-page">
      <TopBar title="Estadísticas" onBack={onBack} />
      <div className="stats-hero">
        <span className="eyebrow light">TU PROGRESO</span>
        <h2>{cleared ? "Un nuevo comienzo" : "¡Vas imparable!"}</h2>
        <p>{cleared ? "Juega una partida para comenzar." : "Estás en el 20% superior de jugadores."}</p>
      </div>
      <div className="stats-content">
        <div className="summary-grid">
          {summary.map(([label, value], index) => (
            <div className={index === 2 ? "highlight" : ""} key={label}>
              <strong>{value}</strong><span>{label}</span>
            </div>
          ))}
        </div>
        <div className="ranking-heading">
          <div><span className="eyebrow">CLASIFICACIÓN</span><h2>Top 10 puntajes</h2></div>
          <Icon name="trophy" />
        </div>
        <div className="ranking">
          {!scores.length ? (
            <div className="empty-ranking"><Icon name="chart" size={30} /><p>Aún no hay puntajes guardados.</p></div>
          ) : scores.map(({ name: player, score: points }, index) => (
            <div className={`ranking-row ${index < 3 ? "podium" : ""}`} key={`${player}-${index}`}>
              <span className="rank">{String(index + 1).padStart(2, "0")}</span>
              <span className="avatar">{player.slice(0, 1)}</span>
              <strong>{player}</strong>
              <span className="points">{points.toLocaleString("es-CO")} <small>pts</small></span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button className={`toggle ${checked ? "on" : ""}`} onClick={onChange} role="switch" aria-checked={checked} aria-label={label}><span /></button>;
}

function Settings({ onBack, onClear, cleared, settings, updateSettings }: { onBack: () => void; onClear: () => void; cleared: boolean; settings: { sound: boolean; vibration: boolean; dark: boolean }; updateSettings: (value: { sound: boolean; vibration: boolean; dark: boolean }) => void }) {
  const { sound, vibration, dark } = settings;

  const rows = [
    { icon: "sound" as IconName, title: "Sonido", text: "Efectos y música del juego", value: sound, action: () => updateSettings({ ...settings, sound: !sound }) },
    { icon: "vibrate" as IconName, title: "Vibración", text: "Respuesta al tocar una letra", value: vibration, action: () => updateSettings({ ...settings, vibration: !vibration }) },
    { icon: "theme" as IconName, title: "Tema oscuro", text: dark ? "Oscuro activado" : "Claro activado", value: dark, action: () => updateSettings({ ...settings, dark: !dark }) },
  ];

  return (
    <main className={`screen page settings-page ${dark ? "dark-mode" : ""}`}>
      <TopBar title="Configuración" onBack={onBack} />
      <div className="settings-content">
        <div className="settings-intro">
          <div className="settings-mark"><Icon name="settings" size={30} /></div>
          <div><span className="eyebrow">A TU MANERA</span><h2>Personaliza tu juego</h2><p>Ajusta la experiencia como prefieras.</p></div>
        </div>
        <span className="group-label">PREFERENCIAS</span>
        <div className="settings-list">
          {rows.map((row) => (
            <div className="setting-row" key={row.title}>
              <span className="setting-icon"><Icon name={row.icon} /></span>
              <span className="setting-copy"><strong>{row.title}</strong><small>{row.text}</small></span>
              <Toggle checked={row.value} onChange={row.action} label={`${row.title}: ${row.value ? "activado" : "desactivado"}`} />
            </div>
          ))}
        </div>
        <span className="group-label danger-label">DATOS Y PRIVACIDAD</span>
        <div className="danger-zone">
          <div><strong>Borrar estadísticas</strong><p>Elimina partidas, rachas y puntajes guardados en este dispositivo.</p></div>
          <button className="danger-button" onClick={onClear} disabled={cleared}><Icon name="trash" size={20} /> {cleared ? "Datos borrados" : "Borrar estadísticas"}</button>
        </div>
        <p className="version">El Ahorcado Móvil · Versión 1.0</p>
      </div>
    </main>
  );
}

function Instructions({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="instructions-title">
      <div className="instructions-modal">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Cerrar instrucciones"><Icon name="close" /></button>
        <span className="eyebrow">CÓMO JUGAR</span>
        <h2 id="instructions-title">Descubre la palabra</h2>
        <div className="instruction-step"><span>1</span><p>Elige una categoría y el nivel de dificultad.</p></div>
        <div className="instruction-step"><span>2</span><p>Toca letras del teclado para completar la palabra.</p></div>
        <div className="instruction-step"><span>3</span><p>Resuelve antes de perder tus seis vidas. ¡Buena suerte!</p></div>
        <button className="primary-button" onClick={onClose}>¡Entendido!</button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [entry, setEntry] = useState<WordEntry>(palabras[0]);
  const [difficulty, setDifficulty] = useState("Medio");
  const [gameId, setGameId] = useState(0);
  const [result, setResult] = useState<{ won: boolean; score: number } | null>(null);
  const [instructions, setInstructions] = useState(false);
  const [statsVersion, setStatsVersion] = useState(0);
  const [settings, setSettings] = useState(() => {
    try { return { sound: true, vibration: true, dark: false, ...JSON.parse(window.localStorage.getItem("ahorcado-settings") || "{}") }; }
    catch { return { sound: true, vibration: true, dark: false }; }
  });
  useEffect(() => { window.localStorage.setItem("ahorcado-settings", JSON.stringify(settings)); document.documentElement.dataset.theme = settings.dark ? "dark" : "light"; }, [settings]);

  const startGame = (nextCategory: typeof CATEGORIES[number], nextDifficulty: string) => {
    const eligible = palabras.filter((item) => (nextCategory.id === "aleatoria" || item.categoria === nextCategory.id) && item.nivel === nextDifficulty);
    const chosen = eligible[Math.floor(Math.random() * eligible.length)];
    setEntry(chosen);
    setCategory(nextCategory);
    setDifficulty(nextDifficulty);
    setGameId((id) => id + 1);
    setResult(null);
    setScreen("game");
  };

  const clearStats = () => {
    window.localStorage.setItem("ahorcado-stats", JSON.stringify(EMPTY_STATS));
    setStatsVersion((value) => value + 1);
  };

  const finishGame = (won: boolean, score: number) => {
    if (result) return;
    playFeedback(won, settings);
    setResult({ won, score });
    const current = readStats();
    const streak = won ? current.streak + 1 : 0;
    const next: StoredStats = { played: current.played + 1, won: current.won + Number(won), streak, bestStreak: Math.max(current.bestStreak, streak), scores: [...current.scores, { name: name.trim() || "Jugador", score: Math.round(score) }].sort((a, b) => b.score - a.score).slice(0, 10) };
    window.localStorage.setItem("ahorcado-stats", JSON.stringify(next));
    setStatsVersion((value) => value + 1);
  };
  void statsVersion;

  return (
    <div className="app-shell">
      <div className="phone-frame">
        {screen === "splash" && <Splash onContinue={() => setScreen("home")} />}
        {screen === "home" && <Home name={name} setName={setName} navigate={setScreen} showInstructions={() => setInstructions(true)} />}
        {screen === "setup" && <Setup onBack={() => setScreen("home")} onStart={startGame} />}
        {screen === "game" && <Game key={gameId} category={category} entry={entry} difficulty={difficulty} settings={settings} onBack={() => setScreen("setup")} onResult={finishGame} />}
        {screen === "stats" && <Stats onBack={() => setScreen("home")} cleared={false} />}
        {screen === "settings" && <Settings onBack={() => setScreen("home")} onClear={clearStats} cleared={readStats().played === 0} settings={settings} updateSettings={setSettings} />}
        {instructions && <Instructions onClose={() => setInstructions(false)} />}
        {result && (
          <ResultModal
            won={result.won}
            word={entry.palabra}
            score={result.score}
            onReplay={() => {
              setResult(null);
              setGameId((id) => id + 1);
            }}
            onMenu={() => {
              setResult(null);
              setScreen("home");
            }}
          />
        )}
      </div>
    </div>
  );
}
