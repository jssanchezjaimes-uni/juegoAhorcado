import React from "react";
import { Text, View } from "react-native";
// Resume vidas y puntaje; solo agrega el cronómetro cuando el nivel lo requiere.
export default function Marcador({ vidas, puntaje, tiempo, colores }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        backgroundColor: colores.primarioOscuro,
        borderRadius: 14,
      }}
    >
      {[
        [`Vidas`, `${vidas} / 6`],
        [`Puntaje`, puntaje],
        ...(tiempo == null
          ? []
          : [
              [
                "Tiempo",
                `${Math.floor(tiempo / 60)}:${String(tiempo % 60).padStart(2, "0")}`,
              ],
            ]),
      ].map(([label, value]) => (
        <View key={label} style={{ alignItems: "center" }}>
          <Text style={{ color: "#C8D7EA", fontSize: 12, fontWeight: "700" }}>
            {label}
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 17,
              fontWeight: "900",
              marginTop: 3,
            }}
          >
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}
