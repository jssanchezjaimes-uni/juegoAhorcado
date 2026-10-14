import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioScreen from "../screens/InicioScreen";
import InstruccionesScreen from "../screens/InstruccionesScreen";
import CategoriaScreen from "../screens/CategoriaScreen";
import JuegoScreen from "../screens/JuegoScreen";
import EstadisticasScreen from "../screens/EstadisticasScreen";
import ConfiguracionScreen from "../screens/ConfiguracionScreen";
const Stack = createNativeStackNavigator();

// Declara el recorrido y las pantallas disponibles dentro de la aplicación.
export default function AppNavigator() {
  return <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <Stack.Screen name="Inicio" component={InicioScreen}/>
    <Stack.Screen name="Instrucciones" component={InstruccionesScreen}/>
    <Stack.Screen name="Categoría" component={CategoriaScreen}/>
    <Stack.Screen name="Juego" component={JuegoScreen} options={{ gestureEnabled: false }}/>
    <Stack.Screen name="Estadísticas" component={EstadisticasScreen}/>
    <Stack.Screen name="Configuración" component={ConfiguracionScreen}/>
  </Stack.Navigator>;
}
