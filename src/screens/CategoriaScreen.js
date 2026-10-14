import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";
import { palabras } from "../data/palabras";
import { obtenerRanking } from "../storage/almacenamiento";
import { Boton, Encabezado, Pantalla } from "../components/UI";

// Opciones que alimentan la selección de tema y nivel de la próxima partida.
const categorias = [
  { id: "aleatoria", nombre: "Aleatoria", icono: "🎲" },
  { id: "capitales", nombre: "Capitales", icono: "🗺️" },
  { id: "animales", nombre: "Animales", icono: "🦜" },
  { id: "frutas", nombre: "Frutas", icono: "🥭" },
  { id: "comidas", nombre: "Comidas", icono: "🍲" },
];
const niveles = ["Fácil", "Medio", "Difícil"];

export default function CategoriaScreen({ navigation }) {
  const { colores, nombreJugador } = useTema();
  // Guarda la selección y carga los puntajes para mostrar el récord de la categoría.
  const [categoria, setCategoria] = useState("aleatoria");
  const [nivel, setNivel] = useState("Fácil");
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    obtenerRanking().then(setRanking);
  }, []);

  // Filtra el banco por selección, toma una palabra al azar y abre la partida.
  const empezar = () => {
    if (!nombreJugador.trim()) {
      Alert.alert("Escribe tu nombre", "Regresa al inicio y escribe tu nombre para comenzar.");
      return;
    }
    const opciones = palabras.filter((p) => (categoria === "aleatoria" || p.categoria === categoria) && p.nivel === nivel);
    if (!opciones.length) {
      Alert.alert("Sin palabras", "No hay palabras disponibles para esta selección.");
      return;
    }
    const palabra = opciones[Math.floor(Math.random() * opciones.length)];
    navigation.navigate("Juego", { partida: { ...palabra, categoria: categoria === "aleatoria" ? palabra.categoria : categoria } });
  };

  // Obtiene el mejor puntaje guardado que corresponda a la categoría elegida.
  const record = ranking
    .filter((r) => categoria === "aleatoria" || r.categoria === categoria)
    .reduce((max, r) => Math.max(max, r.puntaje), 0);

  return (
    <Pantalla colores={colores}>
      <Encabezado titulo="Categoría y nivel" volver={() => navigation.goBack()} colores={colores} />
      <ScrollView contentContainerStyle={{ padding: 18, gap: 12 }}>
        <Text style={{ color: colores.texto, fontWeight: "900", fontSize: 20 }}>Elige una categoría</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {categorias.map((item) => (
            <Boton
              key={item.id}
              titulo={`${item.icono}  ${item.nombre}${item.id === categoria && record ? ` · Récord ${record}` : ""}`}
              onPress={() => setCategoria(item.id)}
              colores={colores}
              secundario={item.id !== categoria}
              style={{ width: "48%", flexGrow: 1 }}
            />
          ))}
        </View>
        <Text style={{ color: colores.texto, fontWeight: "900", fontSize: 20, marginTop: 8 }}>Dificultad</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {niveles.map((item) => (
            <Boton key={item} titulo={item} onPress={() => setNivel(item)} colores={colores} secundario={item !== nivel} style={{ flex: 1 }} />
          ))}
        </View>
        <Text style={{ color: colores.secundario, textAlign: "center" }}>Récord de esta categoría: {record} puntos</Text>
        <Boton titulo="Comenzar partida" onPress={empezar} colores={colores} />
      </ScrollView>
    </Pantalla>
  );
}
