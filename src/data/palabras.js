// Cada fila agrupa una categoría y dificultad; cada entrada contiene palabra y pista.
// El banco tiene 15 palabras por categoría, repartidas entre los tres niveles.
const rows = [
  ["capitales", "Fácil", "CALI|Capital del Valle del Cauca", "NEIVA|Capital del Huila", "PASTO|Capital de Nariño", "TUNJA|Capital de Boyacá", "IBAGUÉ|Capital del Tolima"],
  ["capitales", "Medio", "PEREIRA|Capital de Risaralda, en el Eje Cafetero", "ARMENIA|Capital del Quindío", "POPAYAN|La ciudad blanca del Cauca", "RIOHACHA|Capital de La Guajira", "FLORENCIA|Capital del Caquetá"],
  ["capitales", "Difícil", "BUCARAMANGA|La ciudad bonita de Santander", "BARRANQUILLA|La puerta de oro de Colombia", "VILLAVICENCIO|Puerta de entrada a los Llanos", "VALLEDUPAR|Capital del Cesar, famosa por su festival vallenato", "SANTA MARTA|Ciudad caribeña junto a la Sierra Nevada"],
  ["animales", "Fácil", "PUMA|Felino silvestre de América", "RANA|Anfibio que salta y croa", "TIGRE|Gran felino de pelaje rayado", "MONO|Primate de cola larga", "LORO|Ave colorida que puede imitar sonidos"],
  ["animales", "Medio", "ARMADILLO|Mamífero acorazado de los Llanos", "CAPIBARA|El roedor más grande del mundo", "OCELOTE|Felino manchado de las selvas", "ANACONDA|Serpiente constrictora de la Amazonía", "TORTUGA|Reptil de caparazón duro"],
  ["animales", "Difícil", "PUERCOESPIN|Roedor cubierto de púas", "OSO HORMIGUERO|Mamífero de hocico largo que come hormigas", "PERRO DE MONTE|Cánido silvestre de las selvas", "GUACHARACA|Ave ruidosa de los bosques colombianos", "MURCIELAGO|Mamífero nocturno que vuela"],
  ["frutas", "Fácil", "MORA|Fruta pequeña y morada para jugos", "MANGO|Fruta amarilla y dulce", "LULO|Fruta ácida típica de la lulada", "BOROJÓ|Fruta del Pacífico de pulpa aromática", "CURUBA|Fruta andina usada en jugos"],
  ["frutas", "Medio", "GUANABANA|Fruta verde de pulpa blanca y cremosa", "MARACUYA|Fruta ácida conocida como fruta de la pasión", "TAMARINDO|Vaina agridulce usada en bebidas", "GUAYABA|Fruta rosada o blanca para bocadillo", "CIRUELA|Fruta dulce de piel morada o roja"],
  ["frutas", "Difícil", "GRANADILLA|Fruta dulce que se abre para comer sus semillas", "CHONTADURO|Fruto de palma que se come con miel", "MAMONCILLO|Fruta pequeña de cáscara verde y pulpa dulce", "TOMATE DE ARBOL|Fruta andina para jugos", "NARANJILLA|Fruta ácida también llamada lulo en algunas regiones"],
  ["comidas", "Fácil", "AREPA|Masa redonda de maíz, dorada en la plancha", "TAMAL|Masa rellena envuelta en hojas", "CALDO|Preparación líquida que se come caliente", "SOPA|Plato caliente que se come con cuchara", "AJIACO|Sopa bogotana con papa y guascas"],
  ["comidas", "Medio", "EMPANADA|Masa rellena y frita, servida con ají", "SANCOCHO|Sopa tradicional con tubérculos y carne", "LECHONA|Cerdo relleno típico del Tolima", "PANDEBONO|Panecillo de queso y almidón de yuca", "CHANGUA|Desayuno cundiboyacense con leche y huevo"],
  ["comidas", "Difícil", "BANDEJA PAISA|Plato abundante con fríjoles, chicharrón y más", "ARROZ CON COCO|Acompañamiento tradicional de la costa Caribe", "MUTE SANTANDEREANO|Sopa espesa de maíz típica de Santander", "BREVAS CON AREQUIPE|Postre de fruta con dulce de leche", "AJIACO SANTAFEREÑO|Sopa bogotana tradicional con pollo y guascas"],
];

// Convierte las filas compactas en objetos fáciles de filtrar desde las pantallas.
export const palabras = rows.flatMap(([categoria, nivel, ...items]) => items.map((item) => {
  const [palabra, pista] = item.split("|");
  return { categoria, nivel, palabra, pista };
}));

export default palabras;
