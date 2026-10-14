export const normalizeLetter = (value: string) => value.replace(/ñ/gi, "\uE000").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleUpperCase("es-CO").replace(/\uE000/g, "Ñ");
export const normalizeWord = (value: string) => normalizeLetter(value);
// Mantiene los mismos multiplicadores de puntuación que la aplicación Expo.
export const LEVEL_MULTIPLIER: Record<string, number> = { "Fácil": 1, "Medio": 2, "Difícil": 3 };
