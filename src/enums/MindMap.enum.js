const example = {
  type: "MINDMAP",
  nodes: [
    {
      id: "1",
      type: "node",
      data: { label: "Node 1" },
      position: { x: 100, y: 100 },
    },
    {
      id: "2",
      type: "node",
      data: { label: "Node 2" },
      position: { x: 300, y: 200 },
    },
  ],
  edges: [{ id: "e1-2", source: "1", target: "2" }],
};

export default {
  example,
};
