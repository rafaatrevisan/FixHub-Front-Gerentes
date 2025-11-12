export interface RelatorioTicketsDTO {
  id: number;
  descricao: string;
  status: string;
  prioridade: string;
  equipeResponsavel: string;
  dataCriacao: string;
  dataResolucao?: string;
  funcionarioResponsavel?: string;
  tempoResolucao?: number;
  cliente?: string;
}
