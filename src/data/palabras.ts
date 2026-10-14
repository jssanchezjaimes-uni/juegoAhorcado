export type Difficulty = "Fácil" | "Medio" | "Difícil";
export type CategoryId = "capitales" | "animales" | "frutas" | "comidas";

export type WordEntry = {
  palabra: string;
  categoria: CategoryId;
  nivel: Difficulty;
  pista: string;
};

// Banco local: 15 palabras por categoría, distribuidas entre los tres niveles.
export const palabras: WordEntry[] = [
  ...[
    ["BOGOTA", "Fácil", "Capital andina conocida por Monserrate"], ["MEDELLIN", "Fácil", "La ciudad de la eterna primavera"], ["CALI", "Fácil", "Capital mundial de la salsa"], ["PASTO", "Fácil", "Ciudad nariñense famosa por su carnaval"], ["NEIVA", "Fácil", "Capital del Huila, junto al río Magdalena"],
    ["CARTAGENA", "Medio", "Ciudad amurallada del Caribe"], ["BARRANQUILLA", "Medio", "La puerta de oro de Colombia"], ["BUCARAMANGA", "Medio", "La ciudad bonita de Santander"], ["MANIZALES", "Medio", "Capital cafetera bajo el Nevado del Ruiz"], ["VILLAVICENCIO", "Medio", "Puerta de entrada a los Llanos"],
    ["POPAYAN", "Difícil", "La ciudad blanca del Cauca"], ["QUIBDO", "Difícil", "Capital chocoana a orillas del Atrato"], ["FLORENCIA", "Difícil", "Capital del Caquetá"], ["RIOHACHA", "Difícil", "Capital de La Guajira junto al Caribe"], ["SINCELEJO", "Difícil", "Capital del departamento de Sucre"],
  ].map(([palabra, nivel, pista]) => ({ palabra, nivel: nivel as Difficulty, pista, categoria: "capitales" as const })),
  ...[
    ["OSO", "Fácil", "Mamífero de anteojos que vive en los Andes"], ["RANA", "Fácil", "Anfibio que salta y croa"], ["TIGRE", "Fácil", "Gran felino de pelaje rayado"], ["MONO", "Fácil", "Primate juguetón de cola larga"], ["LORO", "Fácil", "Ave colorida que puede imitar sonidos"],
    ["CONDOR", "Medio", "Ave emblemática de los Andes"], ["JAGUAR", "Medio", "El felino más grande de América"], ["DELFIN", "Medio", "Mamífero rosado de los ríos amazónicos"], ["TUCAN", "Medio", "Ave tropical de pico grande y colorido"], ["IGUANA", "Medio", "Reptil de sangre fría que toma el sol"],
    ["ARMADILLO", "Difícil", "Mamífero acorazado de los Llanos"], ["GUACAMAYA", "Difícil", "Ave de plumaje brillante de la Amazonía"], ["CHIGUIRO", "Difícil", "El roedor más grande del mundo"], ["OCELOTE", "Difícil", "Felino manchado de las selvas colombianas"], ["MANATI", "Difícil", "Gigante gentil que habita ríos y costas"],
  ].map(([palabra, nivel, pista]) => ({ palabra, nivel: nivel as Difficulty, pista, categoria: "animales" as const })),
  ...[
    ["MORA", "Fácil", "Fruta pequeña y morada, típica de jugos"], ["MANGO", "Fácil", "Fruta amarilla y dulce muy popular"], ["LULO", "Fácil", "Fruta ácida para preparar lulada"], ["PERA", "Fácil", "Fruta verde con forma característica"], ["CIRUELA", "Fácil", "Fruta dulce de piel morada o roja"],
    ["GUANABANA", "Medio", "Fruta verde, dulce y cremosa"], ["PAPAYA", "Medio", "Fruta anaranjada que se come en el desayuno"], ["MARACUYA", "Medio", "Fruta ácida conocida como fruta de la pasión"], ["GRANADILLA", "Medio", "Fruta dulce que se abre para comer sus semillas"], ["CURUBA", "Medio", "Fruta andina alargada usada en jugos"],
    ["TAMARINDO", "Difícil", "Vaina agridulce usada en bebidas"], ["CHONTADURO", "Difícil", "Fruto de palma que se come con miel"], ["ZAPOTE", "Difícil", "Fruta tropical de pulpa anaranjada"], ["GULUPA", "Difícil", "Fruta de cáscara morada, pariente del maracuyá"], ["UCHUVA", "Difícil", "Pequeña fruta dorada cubierta por un capacho"],
  ].map(([palabra, nivel, pista]) => ({ palabra, nivel: nivel as Difficulty, pista, categoria: "frutas" as const })),
  ...[
    ["AREPA", "Fácil", "Redonda, dorada y hecha de maíz"], ["SOPA", "Fácil", "Plato caliente que se come con cuchara"], ["TAMAL", "Fácil", "Masa envuelta en hojas y cocida"], ["AJIACO", "Fácil", "Sopa bogotana con papa y guascas"], ["CALDO", "Fácil", "Preparación líquida reconfortante"],
    ["BANDEJA PAISA", "Medio", "Plato abundante con fríjoles, chicharrón y más"], ["EMPANADA", "Medio", "Masa rellena y frita, servida con ají"], ["SANCOCHO", "Medio", "Sopa tradicional con tubérculos y carne"], ["LECHONA", "Medio", "Cerdo relleno típico del Tolima"], ["PANDebONO", "Medio", "Panecillo de queso y almidón de yuca"],
    ["CHANGUA", "Difícil", "Desayuno cundiboyacense con leche y huevo"], ["FRITANGA", "Difícil", "Picada colombiana de carnes y tubérculos"], ["ARROZ CON COCO", "Difícil", "Acompañamiento caribeño dulce y salado"], ["MUTE SANTANDEREANO", "Difícil", "Sopa espesa de maíz típica de Santander"], ["BREVAS CON AREQUIPE", "Difícil", "Postre colombiano de fruta y dulce de leche"],
  ].map(([palabra, nivel, pista]) => ({ palabra: palabra.toLocaleUpperCase("es-CO"), nivel: nivel as Difficulty, pista, categoria: "comidas" as const })),
];

