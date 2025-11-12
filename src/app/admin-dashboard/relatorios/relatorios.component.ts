import { Component, OnInit } from '@angular/core';
import { RelatoriosService, FiltrosRelatorio } from '../services/relatorios.service';
import { RelatorioTicketsDTO } from '../models/relatorio-tickets.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
  Math = Math;

  // Lista de 
  
  tickets: RelatorioTicketsDTO[] = [];

  // Filtros
  filtros: FiltrosRelatorio = {
    dataInicio: '',
    dataFim: '',
    status: '',
    prioridade: '',
    equipe: '',
    funcionario: ''
  };

  // Opções para os selects
  statusOptions = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'REPROVADO'];
  prioridadeOptions = ['BAIXA', 'REGULAR', 'IMPORTANTE', 'URGENTE'];
  equipeOptions = ['MANUTENCAO', 'LIMPEZA'];

  // Estados
  carregando = false;
  erro = false;
  mensagemErro = '';

  // Paginação e ordenação
  paginaAtual = 1;
  itensPorPagina = 10;
  ticketsFiltrados: RelatorioTicketsDTO[] = [];

  constructor(private relatoriosService: RelatoriosService) {}

  ngOnInit(): void {
    this.definirDatasIniciais();
    this.buscarRelatorio();
  }

  definirDatasIniciais(): void {
    const hoje = new Date();
    const umMesAtras = new Date(hoje);
    umMesAtras.setMonth(hoje.getMonth() - 1);
    this.filtros.dataFim = this.formatarData(hoje);
    this.filtros.dataInicio = this.formatarData(umMesAtras);
  }

  formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  buscarRelatorio(): void {
    this.carregando = true;
    this.erro = false;
    this.mensagemErro = '';
    this.relatoriosService.getRelatorioTickets(this.filtros).subscribe({
      next: (data: RelatorioTicketsDTO[]) => {
        this.tickets = data || [];
        this.ticketsFiltrados = data || [];
        this.carregando = false;
      },
      error: (error: any) => {
        console.error('Erro ao buscar relatório:', error);
        this.erro = true;
        this.mensagemErro = 'Erro ao carregar relatório. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  limparFiltros(): void {
    this.filtros = {
      dataInicio: '',
      dataFim: '',
      status: '',
      prioridade: '',
      equipe: '',
      funcionario: ''
    };
    this.definirDatasIniciais();
    this.buscarRelatorio();
  }

  exportarCSV(): void {
    this.relatoriosService.exportarCSV(this.filtros).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio_tickets_${new Date().getTime()}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Erro ao exportar CSV:', error);
        alert('Erro ao exportar relatório');
      }
    });
  }

  formatarDataExibicao(data: string | Date | null | undefined): string {
    if (!data) return '-';
    const d = new Date(data as any);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('pt-BR');
  }

  getClasseStatus(status: string): string {
  switch (status?.toUpperCase()) {
    case 'CONCLUIDO':
      return 'status-concluido';
    case 'PENDENTE':
      return 'status-pendente';
    case 'EM_ANDAMENTO':
      return 'status-em_andamento';
    case 'REPROVADO':
      return 'status-reprovado';
    default:
      return 'status-default';
  }
}

getClassePrioridade(prioridade: string): string {
  switch (prioridade?.toUpperCase()) {
    case 'BAIXA':
      return 'priority-baixa';
    case 'REGULAR':
      return 'priority-regular';
    case 'IMPORTANTE':
      return 'priority-importante';
    case 'URGENTE':
      return 'priority-urgente';
    default:
      return 'priority-default';
  }
}

  formatarTempo(minutos: number | null | undefined): string {
    if (minutos == null || minutos === 0) return '-';
    const horas = Math.floor(minutos / 60);
    const mins = Math.round(minutos % 60);
    return horas > 0 ? `${horas}h ${mins}min` : `${mins}min`;
  }

  getTicketsPaginados(): RelatorioTicketsDTO[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.ticketsFiltrados.slice(inicio, fim);
  }

  getTotalPaginas(): number {
    return Math.ceil(this.ticketsFiltrados.length / this.itensPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) this.paginaAtual--;
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.getTotalPaginas()) this.paginaAtual++;
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.getTotalPaginas()) this.paginaAtual = pagina;
  }

  getPaginas(): number[] {
    const total = this.getTotalPaginas();
    const paginas: number[] = [];
    const maxPaginas = 5;
    let inicio = Math.max(1, this.paginaAtual - Math.floor(maxPaginas / 2));
    let fim = Math.min(total, inicio + maxPaginas - 1);
    if (fim - inicio < maxPaginas - 1) inicio = Math.max(1, fim - maxPaginas + 1);
    for (let i = inicio; i <= fim; i++) paginas.push(i);
    return paginas;
  }
}
