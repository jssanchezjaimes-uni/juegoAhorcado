import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Contenedor común para aplicar el color de fondo y respetar las zonas seguras.
export function Pantalla({ children, colores, style }) {
  return (
    <SafeAreaView style={[styles.pantalla, { backgroundColor: colores.fondo }, style]}>
      {children}
    </SafeAreaView>
  );
}

// Encabezado de navegación con título y acción para regresar.
export function Encabezado({ titulo, volver, colores }) {
  return (
    <View style={[styles.encabezado, { backgroundColor: colores.primarioOscuro }]}>
      {volver ? (
        <Pressable onPress={volver} accessibilityRole="button" accessibilityLabel="Volver" style={styles.volver}>
          <Text style={styles.flecha}>‹</Text>
        </Pressable>
      ) : <View style={styles.volver} />}
      <Text style={styles.tituloEncabezado}>{titulo}</Text>
      <View style={styles.volver} />
    </View>
  );
}

// Botón reutilizable; el texto secundario usa el color de texto del tema actual.
export function Boton({ titulo, onPress, colores, secundario = false, disabled = false, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.boton,
        {
          backgroundColor: secundario ? colores.fondo : colores.primario,
          borderColor: secundario ? colores.borde : colores.primario,
        },
        secundario && styles.botonSecundario,
        disabled && styles.deshabilitado,
        pressed && styles.presionado,
        style,
      ]}
    >
      <Text style={[styles.textoBoton, secundario && { color: colores.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

// Estilos de estructura y estados compartidos por los componentes de esta carpeta.
const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  encabezado: { minHeight: 58, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  volver: { width: 48, height: 48, justifyContent: "center", alignItems: "center" },
  flecha: { color: "#FFFFFF", fontSize: 38, marginTop: -4 },
  tituloEncabezado: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
  boton: { minHeight: 52, borderWidth: 1, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 14, marginVertical: 4 },
  botonSecundario: { borderWidth: 1.5 },
  textoBoton: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", textAlign: "center" },
  deshabilitado: { opacity: 0.45 },
  presionado: { opacity: 0.8 },
});
