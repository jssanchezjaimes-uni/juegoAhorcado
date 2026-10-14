import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTema } from "../theme/TemaContext";
import { Boton, Pantalla } from "../components/UI";
// Inicio: recoge el nombre y da acceso al juego, instrucciones, estadísticas y ajustes.
export default function InicioScreen({ navigation }) {
  const { colores, nombreJugador, setNombreJugador } = useTema();
  // No permite comenzar hasta que el jugador escriba un nombre.
  const jugar = () => {
    if (!nombreJugador.trim()) {
      Alert.alert(
        "Escribe tu nombre",
        "Necesitamos tu nombre para guardar el puntaje.",
      );
      return;
    }
    navigation.navigate("Categoría");
  };
  return (
    <Pantalla colores={colores}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            backgroundColor: colores.primarioOscuro,
            paddingHorizontal: 24,
            paddingTop: 48,
            paddingBottom: 44,
            borderBottomLeftRadius: 26,
            borderBottomRightRadius: 26,
          }}
        >
          <Text
            style={{ color: "#D7E6F5", fontWeight: "800", letterSpacing: 1 }}
          >
            EL AHORCADO · COLOMBIA
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 33,
              fontWeight: "900",
              marginTop: 18,
            }}
          >
            ¿Listo para el desafío?
          </Text>
          <Text style={{ color: "#D7E6F5", fontSize: 15, marginTop: 8 }}>
            Descubre palabras de nuestra tierra.
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ padding: 20, gap: 8 }}
        >
          <Text
            style={{ color: colores.texto, fontWeight: "800", marginTop: 6 }}
          >
            Tu nombre
          </Text>
          <TextInput
            value={nombreJugador}
            onChangeText={setNombreJugador}
            maxLength={18}
            placeholder="Escribe tu nombre para empezar"
            placeholderTextColor={colores.secundario}
            returnKeyType="done"
            style={{
              minHeight: 52,
              borderWidth: 1,
              borderColor: colores.borde,
              borderRadius: 13,
              paddingHorizontal: 14,
              color: colores.texto,
              backgroundColor: colores.fondo,
              marginBottom: 6,
            }}
          />
          <Boton titulo="Jugar" onPress={jugar} colores={colores} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Boton
              titulo="Instrucciones"
              onPress={() => navigation.navigate("Instrucciones")}
              colores={colores}
              secundario
              style={{ flex: 1 }}
            />
            <Boton
              titulo="Estadísticas"
              onPress={() => navigation.navigate("Estadísticas")}
              colores={colores}
              secundario
              style={{ flex: 1 }}
            />
          </View>
          <Boton
            titulo="Configuración"
            onPress={() => navigation.navigate("Configuración")}
            colores={colores}
            secundario
          />
          {/* Firma del autor, colocada debajo de las acciones como en el diseño. */}
          <View style={{ alignItems: "center", marginTop: 6 }}>
            <Text style={{ color: colores.secundario, fontSize: 10, fontWeight: "800", letterSpacing: 1.5 }}>
              HECHO POR
            </Text>
            <Text style={{ color: colores.texto, fontSize: 13, fontWeight: "800", marginTop: 3 }}>
              Joan Sanchez
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Pantalla>
  );
}
