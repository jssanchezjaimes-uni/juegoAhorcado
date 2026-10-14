import React from "react";
import Svg, { Circle, Line } from "react-native-svg";

// Dibuja la estructura y agrega una parte del cuerpo por cada error cometido.
export default function Ahorcado({ errores = 0, colores }) {
  const estructura = colores?.texto || "#1F3864";
  const error = colores?.error || "#D64545";
  const props = { strokeWidth: 5, strokeLinecap: "round" };
  return (
    <Svg width="190" height="165" viewBox="0 0 190 165" accessibilityLabel={`Ahorcado, ${errores} errores`}>
      <Line x1="18" y1="153" x2="153" y2="153" stroke={estructura} {...props} />
      <Line x1="45" y1="153" x2="45" y2="14" stroke={estructura} {...props} />
      <Line x1="45" y1="14" x2="130" y2="14" stroke={estructura} {...props} />
      <Line x1="130" y1="14" x2="130" y2="32" stroke={estructura} {...props} />
      {errores >= 1 && <Circle cx="130" cy="49" r="17" stroke={error} strokeWidth="5" fill="none" />}
      {errores >= 2 && <Line x1="130" y1="66" x2="130" y2="108" stroke={error} {...props} />}
      {errores >= 3 && <Line x1="130" y1="76" x2="106" y2="94" stroke={error} {...props} />}
      {errores >= 4 && <Line x1="130" y1="76" x2="154" y2="94" stroke={error} {...props} />}
      {errores >= 5 && <Line x1="130" y1="108" x2="109" y2="139" stroke={error} {...props} />}
      {errores >= 6 && <Line x1="130" y1="108" x2="151" y2="139" stroke={error} {...props} />}
    </Svg>
  );
}
