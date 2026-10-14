import React from "react";
import { Text, View } from "react-native";
import { normalizar } from "../hooks/useJuego";

// Muestra cada carácter descubierto y mantiene los espacios de palabras compuestas.
export default function PalabraOculta({
  palabra,
  letrasAcertadas = [],
  colores,
}) {
  return (
    <View
      style={{
        minHeight: 62,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }}
    >
      {Array.from(palabra).map((caracter, index) =>
        caracter === " " ? (
          <View key={`space-${index}`} style={{ width: 17 }} />
        ) : (
          <View
            key={`${caracter}-${index}`}
            style={{
              minWidth: 25,
              height: 39,
              paddingHorizontal: 2,
              borderBottomWidth: 3,
              borderColor: colores.borde,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: letrasAcertadas.includes(normalizar(caracter))
                  ? colores.acierto
                  : "transparent",
              }}
            >
              {letrasAcertadas.includes(normalizar(caracter)) ? caracter : "_"}
            </Text>
          </View>
        ),
      )}
    </View>
  );
}
