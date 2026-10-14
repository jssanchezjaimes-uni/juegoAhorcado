import React, { useEffect, useRef } from "react";
import { Alert, BackHandler, ScrollView, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";
import useJuego from "../hooks/useJuego";
import Ahorcado from "../components/Ahorcado";
import PalabraOculta from "../components/PalabraOculta";
import Teclado from "../components/Teclado";
import Marcador from "../components/Marcador";
import ModalResultado from "../components/ModalResultado";
import { Boton, Encabezado, Pantalla } from "../components/UI";
import { guardarResultado } from "../storage/almacenamiento";
import { palabras } from "../data/palabras";

// Une el hook de juego con sus componentes y controla la salida y el guardado final.
export default function JuegoScreen({ navigation, route }) {
  const { colores, configuracion, nombreJugador } = useTema();
  const partida = route.params?.partida;
  const juego = useJuego({ partida, configuracion });
  const guardado = useRef(false);
  // En Android, pide confirmación antes de abandonar una ronda activa.
  useEffect(() => {
    if (juego.estado !== "jugando") return undefined;
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert("Salir de la partida", "¿Quieres abandonar esta partida?", [
        { text: "Seguir jugando", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => navigation.navigate("Inicio"),
        },
      ]);
      return true;
    });
    return () => back.remove();
  }, [juego.estado, navigation]);
  // Guarda cada resultado una sola vez cuando la ronda termina.
  useEffect(() => {
    if (juego.estado === "jugando" || guardado.current) return;
    guardado.current = true;
    void guardarResultado({
      nombre: nombreJugador.trim() || "Jugador",
      puntaje: juego.puntaje,
      categoria: partida.categoria,
      nivel: partida.nivel,
      gano: juego.estado === "ganado",
    });
  }, [juego.estado, juego.puntaje, nombreJugador, partida]);
  // Elige otra palabra del mismo nivel y categoría para la revancha.
  const revancha = () => {
    const opciones = palabras.filter(
      (p) =>
        p.categoria === partida.categoria &&
        p.nivel === partida.nivel &&
        p.palabra !== partida.palabra,
    );
    const nueva = opciones.length
      ? opciones[Math.floor(Math.random() * opciones.length)]
      : partida;
    navigation.replace("Juego", { partida: nueva, ronda: Date.now() });
  };
  return (
    <Pantalla colores={colores}>
      <Encabezado
        titulo={`${partida.categoria} · ${partida.nivel}`}
        volver={() => {
          if (juego.estado === "jugando")
            Alert.alert(
              "Salir de la partida",
              "¿Quieres abandonar esta partida?",
              [
                { text: "Seguir jugando", style: "cancel" },
                { text: "Salir", onPress: () => navigation.navigate("Inicio") },
              ],
            );
          else navigation.navigate("Inicio");
        }}
        colores={colores}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: 8,
          paddingBottom: 18,
          gap: 10,
        }}
      >
        <Marcador
          vidas={juego.vidasRestantes}
          puntaje={juego.puntaje}
          tiempo={juego.tiempoRestante}
          colores={colores}
        />
        <View
          style={{
            minHeight: 170,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: colores.superficie,
            borderRadius: 16,
            padding: 6,
          }}
        >
          <Ahorcado errores={juego.errores} colores={colores} />
          <View
            style={{
              maxWidth: "45%",
              borderLeftWidth: 3,
              borderLeftColor: "#F1C940",
              padding: 10,
              backgroundColor: colores.fondo,
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
            }}
          >
            <Text
              style={{
                color: colores.primario,
                fontWeight: "900",
                marginBottom: 4,
              }}
            >
              Pista
            </Text>
            <Text
              style={{ color: colores.texto, fontSize: 13, lineHeight: 19 }}
            >
              {juego.pistaVisible
                ? juego.pista
                : "Usa una pista para descubrir una ayuda."}
            </Text>
          </View>
        </View>
        <PalabraOculta
          palabra={juego.palabra}
          letrasAcertadas={juego.letrasAcertadas}
          colores={colores}
        />
        <Text
          style={{
            color: colores.secundario,
            textAlign: "center",
            fontWeight: "800",
          }}
        >
          Categoría: {partida.categoria}
        </Text>
        <Boton
          titulo={`Usar pista (${juego.pistasDisponibles}) · −15 puntos`}
          onPress={juego.usarPista}
          colores={colores}
          secundario
          disabled={!juego.pistasDisponibles}
        />
        <Text
          style={{
            color: colores.secundario,
            fontSize: 12,
            textAlign: "center",
            fontWeight: "800",
            letterSpacing: 1,
          }}
        >
          ELIGE UNA LETRA
        </Text>
        <Teclado
          letrasAcertadas={juego.letrasAcertadas}
          letrasFalladas={juego.letrasFalladas}
          onLetra={juego.seleccionarLetra}
          colores={colores}
        />
      </ScrollView>
      <ModalResultado
        visible={juego.estado !== "jugando"}
        ganado={juego.estado === "ganado"}
        palabra={partida.palabra}
        puntaje={juego.puntaje}
        onRevancha={revancha}
        onMenu={() => navigation.navigate("Inicio")}
        colores={colores}
      />
    </Pantalla>
  );
}
