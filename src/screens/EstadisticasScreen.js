import React, { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTema } from "../theme/TemaContext";
import { obtenerEstadisticas, obtenerRanking } from "../storage/almacenamiento";
import { Encabezado, Pantalla } from "../components/UI";

// Lee los datos al entrar y presenta el resumen y el Top 10 con FlatList.
export default function EstadisticasScreen({ navigation }) {
  const { colores } = useTema();
  const [stats, setStats] = useState({ jugadas: 0, ganadas: 0, perdidas: 0, rachaActual: 0, mejorRacha: 0 });
  const [ranking, setRanking] = useState([]);

  // Vuelve a consultar AsyncStorage al abrir esta pantalla para mostrar datos recientes.
  useFocusEffect(useCallback(() => {
    let activa = true;
    Promise.all([obtenerEstadisticas(), obtenerRanking()]).then(([s, r]) => {
      if (activa) {
        setStats(s);
        setRanking(r);
      }
    });
    return () => { activa = false; };
  }, []));

  // Calcula el porcentaje de victorias a partir del número de partidas registradas.
  const porcentaje = stats.jugadas ? Math.round((stats.ganadas / stats.jugadas) * 100) : 0;
  const resumen = [
    ["Partidas", stats.jugadas],
    ["Ganadas", stats.ganadas],
    ["Victorias", `${porcentaje}%`],
    ["Racha actual", stats.rachaActual],
    ["Mejor racha", stats.mejorRacha],
  ];

  return (
    <Pantalla colores={colores}>
      <Encabezado titulo="Estadísticas" volver={() => navigation.goBack()} colores={colores} />
      <FlatList
        data={ranking}
        keyExtractor={(item, index) => `${item.fecha}-${index}`}
        contentContainerStyle={{ padding: 18, gap: 10, paddingBottom: 28 }}
        ListHeaderComponent={(
          <>
            <Text style={{ color: colores.texto, fontSize: 21, fontWeight: "900", marginBottom: 4 }}>Tu progreso</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 9, marginBottom: 12 }}>
              {resumen.map(([label, value]) => (
                <View key={label} style={{ width: "48%", flexGrow: 1, minHeight: 76, borderRadius: 14, backgroundColor: colores.superficie, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ color: colores.primario, fontSize: 22, fontWeight: "900" }}>{value}</Text>
                  <Text style={{ color: colores.texto, fontSize: 12, fontWeight: "700" }}>{label}</Text>
                </View>
              ))}
            </View>
            <Text style={{ color: colores.texto, fontSize: 20, fontWeight: "900", marginBottom: 4 }}>Top 10 puntajes</Text>
            {ranking.length === 0 && <Text style={{ color: colores.secundario, paddingVertical: 12 }}>Aún no hay puntajes guardados.</Text>}
          </>
        )}
        renderItem={({ item, index }) => (
          <View style={{ minHeight: 54, borderBottomWidth: 1, borderColor: colores.borde, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
            <Text style={{ color: colores.texto, fontWeight: "700", flex: 1 }}>{index + 1}. {item.nombre} · {item.categoria} ({item.nivel})</Text>
            <Text style={{ color: colores.primario, fontWeight: "900" }}>{item.puntaje}</Text>
          </View>
        )}
      />
    </Pantalla>
  );
}
