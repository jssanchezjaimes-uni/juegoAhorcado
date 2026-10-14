import React, { useCallback, useState } from "react";
import { Alert, ScrollView, Switch, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTema } from "../theme/TemaContext";
import { borrarDatosJuego, obtenerEstadisticas } from "../storage/almacenamiento";
import { Boton, Encabezado, Pantalla } from "../components/UI";

// Permite modificar preferencias y confirmar el borrado de resultados guardados.
export default function ConfiguracionScreen({ navigation }) {
  const { colores, configuracion, actualizarConfiguracion } = useTema();
  const [hayDatos, setHayDatos] = useState(false);

  // Consulta si hay partidas guardadas para habilitar o deshabilitar el borrado.
  useFocusEffect(useCallback(() => {
    obtenerEstadisticas().then((stats) => setHayDatos(stats.jugadas > 0));
  }, []));

  // Pide confirmación antes de borrar el ranking y las estadísticas locales.
  const confirmarBorrado = () => Alert.alert(
    "Borrar datos",
    "Se borrarán las estadísticas y el top 10 de este dispositivo.",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          await borrarDatosJuego();
          setHayDatos(false);
          Alert.alert("Datos borrados", "Las estadísticas se reiniciaron.");
        },
      },
    ],
  );

  // Preferencias disponibles; el tema se guarda como una opción de texto.
  const opciones = [["Sonido", "sonido"], ["Vibración", "vibracion"], ["Tema oscuro", "tema"]];

  return (
    <Pantalla colores={colores}>
      <Encabezado titulo="Configuración" volver={() => navigation.goBack()} colores={colores} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        {opciones.map(([label, key]) => {
          const valor = key === "tema" ? configuracion.tema === "oscuro" : configuracion[key];
          return (
            <View key={key} style={{ minHeight: 60, borderRadius: 12, backgroundColor: colores.superficie, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: colores.texto, fontSize: 15, fontWeight: "700" }}>{label}</Text>
              <Switch
                value={valor}
                onValueChange={(activo) => actualizarConfiguracion(key === "tema" ? { tema: activo ? "oscuro" : "claro" } : { [key]: activo })}
                trackColor={{ true: colores.acierto }}
              />
            </View>
          );
        })}
        <Text style={{ color: colores.texto, fontSize: 20, fontWeight: "900", marginTop: 12 }}>Datos</Text>
        <Boton titulo="Borrar estadísticas" onPress={confirmarBorrado} colores={colores} secundario disabled={!hayDatos} />
        <Text style={{ color: colores.secundario, fontSize: 14 }}>La configuración y tus resultados se guardan en este dispositivo.</Text>
      </ScrollView>
    </Pantalla>
  );
}
