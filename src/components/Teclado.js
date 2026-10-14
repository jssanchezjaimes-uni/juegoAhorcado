import React from "react";
import { Pressable, Text, View } from "react-native";

// Teclado en filas para que las 27 letras, incluida la Ñ, quepan en pantallas pequeñas.
// Cada tecla mide 48 dp y cambia de color y se deshabilita después de usarla.
const filas = ["ABCDEFG", "HIJKLMN", "ÑOPQRST", "UVWXYZ"];
export default function Teclado({
  letrasAcertadas = [],
  letrasFalladas = [],
  onLetra,
  colores,
}) {
  return (
    <View style={{ gap: 7, alignItems: "center" }}>
      {filas.map((fila) => (
        <View
          key={fila}
          style={{ flexDirection: "row", justifyContent: "center", gap: 5 }}
        >
          {Array.from(fila).map((letra) => {
            const acierto = letrasAcertadas.includes(letra),
              fallo = letrasFalladas.includes(letra),
              usada = acierto || fallo;
            return (
              <Pressable
                key={letra}
                accessibilityRole="button"
                accessibilityLabel={`Letra ${letra}`}
                disabled={usada}
                onPress={() => onLetra(letra)}
                style={({ pressed }) => ({
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: acierto
                    ? colores.acierto
                    : fallo
                      ? colores.error
                      : colores.superficie,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text
                  style={{
                    color: usada ? "#FFFFFF" : colores.texto,
                    fontWeight: "800",
                    fontSize: 15,
                  }}
                >
                  {letra}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
