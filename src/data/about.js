export function buildHistoryStats(vehicleCount) {
  return [
    { value: "2026", label: "Ano de Criacao" },
    { value: vehicleCount, label: "Viaturas em Catalogo" },
    { value: "4", label: "Areas Principais" },
    { value: "1", label: "Projeto PAP Completo" },
  ];
}

export const coreValues = [
  {
    title: "Excelencia",
    text: "Cada detalhe do projeto foi pensado para transmitir qualidade, clareza e consistencia visual.",
    icon: "award",
  },
  {
    title: "Confianca",
    text: "A estrutura do website foi desenvolvida para comunicar informacao de forma clara, organizada e fiavel.",
    icon: "people",
  },
  {
    title: "Paixao",
    text: "O interesse pelo universo automovel esteve presente em todas as decisoes criativas e funcionais.",
    icon: "spark",
  },
  {
    title: "Inovacao",
    text: "Foram aplicadas ferramentas e abordagens atuais para construir uma experiencia moderna e evolutiva.",
    icon: "target",
  },
];
