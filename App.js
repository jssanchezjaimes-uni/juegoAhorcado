// Ahorcado_by JoanSanchez
import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "react-native";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { colores } from "./src/theme/colores";
import {
  CONFIGURACION_INICIAL,
  guardarConfiguracion,
  obtenerConfiguracion,
} from "./src/storage/almacenamiento";
import { TemaContext, useTema } from "./src/theme/TemaContext";

// Mantiene las preferencias y los datos compartidos mientras se navega por la app.
export function TemaProvider({ children }) {
  const [configuracion, setConfiguracion] = useState(CONFIGURACION_INICIAL);
  const [nombreJugador, setNombreJugador] = useState("");

  useEffect(() => {
    // Recupera la última configuración guardada; si no hay datos, se conserva la inicial.
    obtenerConfiguracion().then(setConfiguracion);
  }, []);

  // Actualiza el estado visual y persiste los cambios del usuario en AsyncStorage.
  const actualizarConfiguracion = (cambios) => {
    setConfiguracion((actual) => {
      const nueva = { ...actual, ...cambios };
      void guardarConfiguracion(nueva);
      return nueva;
    });
  };

  const value = useMemo(
    () => ({
      configuracion,
      actualizarConfiguracion,
      nombreJugador,
      setNombreJugador,
      colores: colores[configuracion.tema] || colores.claro,
    }),
    [configuracion, nombreJugador],
  );

  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}

export default function App() {
  // SafeAreaProvider permite respetar las zonas seguras del teléfono en toda la app.
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <AplicacionNavegable />
      </TemaProvider>
    </SafeAreaProvider>
  );
}

function AplicacionNavegable() {
  const { configuracion, colores: paleta } = useTema();
  // Adapta los colores propios del juego al tema que utiliza React Navigation.
  const navTheme = useMemo(
    () => ({
      ...(configuracion.tema === "oscuro" ? DarkTheme : DefaultTheme),
      colors: {
        ...(configuracion.tema === "oscuro" ? DarkTheme : DefaultTheme).colors,
        background: paleta.fondo,
        card: paleta.primarioOscuro,
      },
    }),
    [configuracion.tema, paleta],
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={paleta.primarioOscuro}
      />
      <NavigationContainer theme={navTheme}>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}
