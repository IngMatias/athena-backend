
export function assignProgressToTree(section, contentsMap) {
  if (section.sections && section.sections.length > 0) {
    // Recorrer hijos recursivamente
    const updatedChildren = section.sections.map((s) => assignProgressToTree(s, contentsMap));

    // Promedio del progreso de los hijos
    const completed = updatedChildren.reduce((sum, child) => sum + child.completed, 0);
    const total = updatedChildren.reduce((sum, child) => sum + child.total, 0);

    return {
      ...section,
      sections: updatedChildren,
      completed: completed,
      total: total
    };
  } else {
    // Es hoja: asignar progreso desde contentsMap
    const leafProgress = contentsMap[section.id] ?? {completed: 0, total: 0};

    return {
      ...section,
      completed: leafProgress.completed,
      total: leafProgress.total
    };
  }
}