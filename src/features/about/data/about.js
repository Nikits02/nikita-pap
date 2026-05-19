export function buildHistoryStats(vehicleCount) {
  return [
    { value: "2026", label: "Ano de Criacao" },
    { value: vehicleCount, label: "Viaturas em Catálogo" },
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
    text: "A estrutura do website foi desenvolvida para comunicar informação de forma clara, organizada e fiável.",
    icon: "people",
  },
  {
    title: "Paixao",
    text: "O interesse pelo universo automóvel esteve presente em todas as decisões criativas e funcionais.",
    icon: "spark",
  },
  {
    title: "Inovacao",
    text: "Foram aplicadas ferramentas e abordagens atuais para construir uma experiência moderna e evolutiva.",
    icon: "target",
  },
];
