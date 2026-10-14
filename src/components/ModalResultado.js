import React from "react";
import { Modal, Text, View } from "react-native";
import { Boton } from "./UI";

// Presenta la palabra final y permite empezar otra ronda o volver al menú.
export default function ModalResultado({ visible, ganado, palabra, puntaje, onRevancha, onMenu, colores }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onMenu}>
      <View style={{ flex: 1, backgroundColor: "#0009", justifyContent: "center", padding: 24 }}>
        <View style={{ backgroundColor: colores.fondo, borderRadius: 22, padding: 22 }}>
          <Text style={{ textAlign: "center", fontSize: 48 }}>{ganado ? "🎉" : "💪"}</Text>
          <Text style={{ textAlign: "center", color: colores.texto, fontWeight: "900", fontSize: 24, marginTop: 6 }}>
            {ganado ? "¡Lo lograste!" : "Fin de la partida"}
          </Text>
          <Text style={{ textAlign: "center", color: colores.secundario, marginTop: 9 }}>La palabra era</Text>
          <Text style={{ textAlign: "center", color: colores.primario, fontWeight: "900", fontSize: 23, marginVertical: 8 }}>{palabra}</Text>
          <Text style={{ textAlign: "center", color: colores.texto, fontWeight: "800", marginBottom: 10 }}>Puntaje: {puntaje}</Text>
          <Boton titulo="Jugar de nuevo" onPress={onRevancha} colores={colores} />
          <Boton titulo="Menú" onPress={onMenu} colores={colores} secundario />
        </View>
      </View>
    </Modal>
  );
}
