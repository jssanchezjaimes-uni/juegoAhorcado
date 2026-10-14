import AsyncStorage from "@react-native-async-storage/async-storage";

// Identificadores usados para separar las preferencias, estadísticas y el ranking local.
const KEYS = {
  stats: "@ahorcado_stats",
  ranking: "@ahorcado_ranking",
  config: "@ahorcado_config",
};

// Valores de respaldo que se muestran antes de que exista una partida guardada.
export const ESTADISTICAS_INICIALES = {
  jugadas: 0,
  ganadas: 0,
  perdidas: 0,
  rachaActual: 0,
  mejorRacha: 0,
};

export const CONFIGURACION_INICIAL = {
  sonido: true,
  vibracion: true,
  tema: "claro",
};

// Lee y convierte datos JSON; ante datos inválidos entrega un valor seguro de respaldo.
async function leerJSON(clave, respaldo) {
  try {
    const contenido = await AsyncStorage.getItem(clave);
    if (!contenido) return respaldo;
    const guardado = JSON.parse(contenido);
    if (Array.isArray(respaldo))
      return Array.isArray(guardado) ? guardado : respaldo;
    return { ...respaldo, ...guardado };
  } catch (error) {
    console.warn(`No se pudo leer ${clave}`, error);
    return respaldo;
  }
}

// Centraliza la escritura y captura posibles errores del almacenamiento del dispositivo.
async function guardarJSON(clave, valor) {
  try {
    await AsyncStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn(`No se pudo guardar ${clave}`, error);
    return false;
  }
}

// Funciones pequeñas para leer y guardar cada tipo de dato de la aplicación.
export const obtenerEstadisticas = () =>
  leerJSON(KEYS.stats, ESTADISTICAS_INICIALES);
export const obtenerRanking = async () => {
  const ranking = await leerJSON(KEYS.ranking, []);
  return Array.isArray(ranking) ? ranking : [];
};
export const obtenerConfiguracion = () =>
  leerJSON(KEYS.config, CONFIGURACION_INICIAL);
export const guardarConfiguracion = (configuracion) =>
  guardarJSON(KEYS.config, configuracion);

// Actualiza contadores y rachas, y conserva únicamente los diez puntajes más altos.
export async function guardarResultado({
  nombre,
  puntaje,
  categoria,
  nivel,
  gano,
}) {
  const [estadisticas, rankingActual] = await Promise.all([
    obtenerEstadisticas(),
    obtenerRanking(),
  ]);
  const rachaActual = gano ? estadisticas.rachaActual + 1 : 0;
  const nuevasEstadisticas = {
    jugadas: estadisticas.jugadas + 1,
    ganadas: estadisticas.ganadas + Number(gano),
    perdidas: estadisticas.perdidas + Number(!gano),
    rachaActual,
    mejorRacha: Math.max(estadisticas.mejorRacha, rachaActual),
  };
  const nuevaEntrada = {
    nombre,
    puntaje: Math.round(puntaje),
    categoria,
    nivel,
    fecha: new Date().toISOString(),
  };
  const nuevoRanking = [...rankingActual, nuevaEntrada]
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, 10);
  await Promise.all([
    guardarJSON(KEYS.stats, nuevasEstadisticas),
    guardarJSON(KEYS.ranking, nuevoRanking),
  ]);
  return { estadisticas: nuevasEstadisticas, ranking: nuevoRanking };
}

// Elimina resultados y ranking sin modificar las preferencias del usuario.
export async function borrarDatosJuego() {
  try {
    await AsyncStorage.multiRemove([KEYS.stats, KEYS.ranking]);
    return true;
  } catch (error) {
    console.warn("No se pudieron borrar las estadísticas", error);
    return false;
  }
}
