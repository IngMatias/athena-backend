import MindMap from "../enums/MindMap.enum.js";

import { getContent } from "../utils/prompt.util.js";

export const getMindMapMessages = ({ text }) => {
  return [
    {
      role: "system",
      content: getContent(getSystemPrompt()),
    },
    {
      role: "user",
      content: getContent(getUserPrompt({ text })),
    },
  ];
};

const getSystemPrompt = () => {
  return `
      Genera un mind map en formato JSON utilizando las siguientes especificaciones:
      - Estructura: Sigue el formato del siguiente ejemplo: ${JSON.stringify(
        MindMap.example
      )}.
      - Espaciado: Asegurate de que cada nodo tenga espacio suficiente para no superponerse con otro.
      - Claridad: Asegurate de que las edges no se superpongan.
      - Los nodes y edges serán utilizados para reenderizar un mind map hecho con React Flow.
      - Debes mantener la clave type con el valor indicado.
      - Formato de respuesta: JSON (sin markdown).
      Asegúrate de que el mind map sean claro, coherente y este relacionado con el texto proporcionado.
      Asegúrate de responder solo el JSON pedido sin texto extra.
    `;
};

const getUserPrompt = ({ text }) => {
  return `Genera el mind map relacionado con el siguiente texto: ${text}`;
};
