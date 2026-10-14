import { createContext, useContext } from "react";

// Contexto compartido para acceder al tema y las preferencias desde cualquier pantalla.
export const TemaContext = createContext(null);
// Hook corto para consultar el contexto sin repetir useContext en cada componente.
export const useTema = () => useContext(TemaContext);
