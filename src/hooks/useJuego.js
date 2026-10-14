import { useCallback, useEffect, useMemo, useState } from "react";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";

// Quita tildes para comparar letras, pero conserva la Ñ como letra independiente.
export function normalizar(texto = "") {
  return String(texto)
    .replace(/ñ/gi, "\uE000")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleUpperCase("es-CO")
    .replace(/\uE000/g, "Ñ");
}

// Recursos de sonido incluidos en el proyecto y multiplicadores por dificultad.
const multiplicadores = { Fácil: 1, Medio: 2, Difícil: 3 };
const sonidos = {
  acierto: require("../../assets/sonidos/correct.wav"),
  error: require("../../assets/sonidos/incorrect.wav"),
  victoria: require("../../assets/sonidos/victory.wav"),
  derrota: require("../../assets/sonidos/defeat.wav"),
};

export default function useJuego({ partida, configuracion }) {
  const aciertoAudio = useAudioPlayer(sonidos.acierto);
  const errorAudio = useAudioPlayer(sonidos.error);
  const victoriaAudio = useAudioPlayer(sonidos.victoria);
  const derrotaAudio = useAudioPlayer(sonidos.derrota);
  // Estado que cambia durante una ronda: intentos, pistas, puntaje, tiempo y resultado.
  const [letrasAcertadas, setLetrasAcertadas] = useState([]);
  const [letrasFalladas, setLetrasFalladas] = useState([]);
  const [errores, setErrores] = useState(0);
  const [pistasDisponibles, setPistasDisponibles] = useState(
    partida.nivel === "Fácil" ? 2 : partida.nivel === "Medio" ? 1 : 0,
  );
  const [pistaVisible, setPistaVisible] = useState(false);
  const [pistasUsadas, setPistasUsadas] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(
    partida.nivel === "Difícil" ? 90 : null,
  );
  const [estado, setEstado] = useState("jugando");

  // Compara las letras ya normalizadas para admitir tildes sin alterar lo que se muestra.
  const letrasPalabra = useMemo(
    () => Array.from(partida.palabra).map(normalizar),
    [partida.palabra],
  );
  const solucionada = letrasPalabra.every(
    (letra) => letra === " " || letrasAcertadas.includes(letra),
  );
  const vidasRestantes = Math.max(0, 6 - errores);

  // Reproduce un efecto solo cuando el sonido está activado en la configuración.
  const reproducir = useCallback(
    (player) => {
      if (!configuracion.sonido) return;
      void player.seekTo(0).then(() => player.play());
    },
    [configuracion.sonido],
  );

  // Registra una letra, revela sus apariciones o suma un error y aplica el puntaje.
  const seleccionarLetra = useCallback(
    async (letra, desdePista = false) => {
      const elegida = normalizar(letra);
      if (
        estado !== "jugando" ||
        letrasAcertadas.includes(elegida) ||
        letrasFalladas.includes(elegida)
      )
        return;
      const apariciones = letrasPalabra.filter(
        (actual) => actual === elegida,
      ).length;
      if (apariciones) {
        setLetrasAcertadas((actuales) => [...actuales, elegida]);
        setPuntaje(
          (actual) => actual + apariciones * 10 - (desdePista ? 15 : 0),
        );
        if (!desdePista) reproducir(aciertoAudio);
        if (configuracion.vibracion)
          await Haptics.impactAsync(
            desdePista
              ? Haptics.ImpactFeedbackStyle.Light
              : Haptics.ImpactFeedbackStyle.Medium,
          );
      } else {
        setLetrasFalladas((actuales) => [...actuales, elegida]);
        setErrores((actual) => actual + 1);
        setPuntaje((actual) => actual - 5 - (desdePista ? 15 : 0));
        if (!desdePista) reproducir(errorAudio);
        if (configuracion.vibracion)
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error,
          );
      }
      if (desdePista) setPistasUsadas((actual) => actual + 1);
    },
    [
      estado,
      letrasAcertadas,
      letrasFalladas,
      letrasPalabra,
      reproducir,
      aciertoAudio,
      errorAudio,
      configuracion.vibracion,
    ],
  );

  // La primera pista muestra la descripción; la siguiente puede revelar una letra.
  const usarPista = useCallback(async () => {
    if (estado !== "jugando" || pistasDisponibles <= 0) return;
    setPistasDisponibles((actual) => actual - 1);
    setPuntaje((actual) => actual - 15);
    setPistasUsadas((actual) => actual + 1);
    if (!pistaVisible) {
      setPistaVisible(true);
      if (configuracion.vibracion) await Haptics.selectionAsync();
      return;
    }
    const letrasOcultas = letrasPalabra.filter(
      (letra) => letra !== " " && !letrasAcertadas.includes(letra),
    );
    if (!letrasOcultas.length) return;
    const letra =
      letrasOcultas[Math.floor(Math.random() * letrasOcultas.length)];
    // La pista revela una letra y conserva su penalización; no cuenta como intento fallido.
    setLetrasAcertadas((actuales) =>
      actuales.includes(letra) ? actuales : [...actuales, letra],
    );
    setPuntaje(
      (actual) =>
        actual + letrasPalabra.filter((actual) => actual === letra).length * 10,
    );
    if (configuracion.vibracion) await Haptics.selectionAsync();
  }, [
    estado,
    pistasDisponibles,
    pistaVisible,
    letrasPalabra,
    letrasAcertadas,
    configuracion.vibracion,
  ]);

  // Cuenta regresiva de 90 segundos, activa únicamente en el nivel difícil.
  useEffect(() => {
    if (estado !== "jugando" || partida.nivel !== "Difícil") return undefined;
    const timer = setInterval(
      () => setTiempoRestante((actual) => Math.max(0, actual - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [estado, partida.nivel]);

  // Decide el resultado cuando se completa la palabra, se agotan las vidas o el tiempo.
  useEffect(() => {
    if (estado !== "jugando") return;
    if (solucionada) {
      setPuntaje((actual) => actual + 50 + vidasRestantes * 10);
      setEstado("ganado");
    } else if (
      errores >= 6 ||
      (partida.nivel === "Difícil" && tiempoRestante === 0)
    ) {
      setEstado("perdido");
    }
  }, [
    estado,
    solucionada,
    vidasRestantes,
    errores,
    partida.nivel,
    tiempoRestante,
  ]);

  // Da la respuesta háptica y sonora cuando termina la partida.
  useEffect(() => {
    if (estado === "ganado") {
      reproducir(victoriaAudio);
      if (configuracion.vibracion)
        void Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
    } else if (estado === "perdido") {
      reproducir(derrotaAudio);
      if (configuracion.vibracion)
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [
    estado,
    reproducir,
    victoriaAudio,
    derrotaAudio,
    configuracion.vibracion,
  ]);

  // Aplica el multiplicador al subtotal y expone estado y acciones a la pantalla.
  const puntajeFinal = puntaje * (multiplicadores[partida.nivel] || 1);
  return {
    palabra: partida.palabra,
    pista: partida.pista,
    categoria: partida.categoria,
    nivel: partida.nivel,
    letrasAcertadas,
    letrasFalladas,
    errores,
    pistasDisponibles,
    pistasUsadas,
    pistaVisible,
    puntaje: puntajeFinal,
    subtotal: puntaje,
    tiempoRestante,
    estado,
    vidasRestantes,
    seleccionarLetra,
    usarPista,
  };
}
