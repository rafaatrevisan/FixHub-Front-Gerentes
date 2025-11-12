export interface DesempenhoFuncionarioDTO {
  id: number;
  nome: string;
  cargo: string;
  totalTicketsResolvidos: number;
  tempoMedioResolucao: number;
  ticketsEmAndamento?: number;
  avaliacaoMedia?: number;
}
