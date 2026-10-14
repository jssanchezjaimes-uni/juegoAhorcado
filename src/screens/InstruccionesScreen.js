import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";
import { Boton, Encabezado, Pantalla } from "../components/UI";

// Reglas principales mostradas de forma breve y legible en la pantalla.
const reglas = [
  "Elige una categoría y un nivel. Fácil ofrece 2 pistas y multiplica por ×1; Medio ofrece 1 pista y multiplica por ×2; Difícil tiene 90 segundos y multiplica por ×3.",
  "Adivina las letras antes de que se completen las seis partes del dibujo. En palabras compuestas, los espacios aparecen desde el inicio.",
  "Las tildes no cambian la letra al comparar. La Ñ se conserva como una letra distinta de la N.",
  "Puntuación: +10 por cada aparición acertada, −5 por letra incorrecta, −15 por pista y +50 más 10 por vida restante al ganar. El total se multiplica por el nivel.",
];

export default function InstruccionesScreen({ navigation }) {
  const { colores } = useTema();
  // Presenta las reglas en tarjetas y permite volver al menú al terminar.
  return (
    <Pantalla colores={colores}>
      <Encabezado titulo="Instrucciones" volver={() => navigation.goBack()} colores={colores} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Text style={{ color: colores.texto, fontSize: 21, fontWeight: "900" }}>Descubre la palabra</Text>
        {reglas.map((regla, i) => (
          <View key={regla} style={{ minHeight: 72, padding: 14, borderRadius: 14, backgroundColor: colores.superficie, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={{ color: "#FFFFFF", backgroundColor: colores.primario, width: 32, height: 32, borderRadius: 10, textAlign: "center", textAlignVertical: "center", fontWeight: "900" }}>{i + 1}</Text>
            <Text style={{ flex: 1, color: colores.texto, fontSize: 14, lineHeight: 21 }}>{regla}</Text>
          </View>
        ))}
        <Boton titulo="Entendido" onPress={() => navigation.goBack()} colores={colores} />
      </ScrollView>
    </Pantalla>
  );
}
