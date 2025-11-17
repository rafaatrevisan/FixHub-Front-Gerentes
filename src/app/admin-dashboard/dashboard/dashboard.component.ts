import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardResumoDTO } from '../models/dashboard-resumo.model';
import { GraficoTicketsDTO } from '../models/grafico-tickets.model';
import { DesempenhoFuncionarioDTO } from '../models/desempenho-funcionario.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Filtros de data
  dataInicio: string = '';
  dataFim: string = '';

  // Dados do Resumo
  resumo: DashboardResumoDTO = {
    totalTickets: 0,
    ticketsAbertos: 0,
    ticketsEmAndamento: 0,
    ticketsResolvidos: 0,
    tempoMedioResolucao: 0,
    percentualSLA: 0
  };

  // Dados dos Gráficos
  ticketsPorStatus: GraficoTicketsDTO[] = [];
  ticketsPorPrioridade: GraficoTicketsDTO[] = [];
  ticketsPorEquipe: GraficoTicketsDTO[] = [];

  // Desempenho de Funcionários
  desempenhoFuncionarios: DesempenhoFuncionarioDTO[] = [];

  // Estados de carregamento
  carregandoResumo = true;
  carregandoGraficos = true;
  carregandoDesempenho = true;

  // Erros
  erroResumo = false;
  erroGraficos = false;
  erroDesempenho = false;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.definirFiltroInicial();
    this.carregarDadosDashboard();
  }

  /**
   * Define o filtro inicial como últimos 30 dias
   */
  definirFiltroInicial(): void {
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    this.dataFim = this.formatarDataInput(hoje);
    this.dataInicio = this.formatarDataInput(trintaDiasAtras);
  }

  /**
   * Formata data para input type="date" (yyyy-MM-dd)
   */
  formatarDataInput(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  /**
   * Converte string do input para Date
   */
  converterStringParaDate(dataString: string): Date | undefined {
    if (!dataString) return undefined;
    return new Date(dataString + 'T00:00:00');
  }

  /**
   * Normaliza prioridade (remove acentos)
   */
  normalizarPrioridade(categoria: string): string {
    if (!categoria) return 'desconhecida';
    return categoria
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  /**
   * Carrega todos os dados do dashboard
   */
  carregarDadosDashboard(): void {
    const inicio = this.converterStringParaDate(this.dataInicio);
    const fim = this.converterStringParaDate(this.dataFim);

    this.carregarResumo(inicio, fim);
    this.carregarGraficos(inicio, fim);
    this.carregarDesempenhoFuncionarios(inicio, fim);
  }

  /**
   * Carrega o resumo geral
   */
  carregarResumo(dataInicio?: Date, dataFim?: Date): void {
    this.carregandoResumo = true;
    this.erroResumo = false;

    this.dashboardService.getResumo(dataInicio, dataFim).subscribe({
      next: (data) => {
        this.resumo = data ?? this.resumo;
        this.carregandoResumo = false;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        this.erroResumo = true;
        this.carregandoResumo = false;
      }
    });
  }

  /**
   * Carrega os dados dos gráficos
   */
  carregarGraficos(dataInicio?: Date, dataFim?: Date): void {
    this.carregandoGraficos = true;
    this.erroGraficos = false;

    // Tickets por Status
    this.dashboardService.getTicketsPorStatus(dataInicio, dataFim).subscribe({
      next: (data) => {
        this.ticketsPorStatus = data ?? [];
      },
      error: (error) => {
        console.error('Erro ao carregar tickets por status:', error);
        this.erroGraficos = true;
      }
    });

    // Tickets por Prioridade
    this.dashboardService.getTicketsPorPrioridade(dataInicio, dataFim).subscribe({
      next: (data) => {
        this.ticketsPorPrioridade = data ?? [];
      },
      error: (error) => {
        console.error('Erro ao carregar tickets por prioridade:', error);
        this.erroGraficos = true;
      }
    });

    // Tickets por Equipe
    this.dashboardService.getTicketsPorEquipe(dataInicio, dataFim).subscribe({
      next: (data) => {
        this.ticketsPorEquipe = data ?? [];
        this.carregandoGraficos = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tickets por equipe:', error);
        this.erroGraficos = true;
        this.carregandoGraficos = false;
      }
    });
  }

  /**
   * Carrega o desempenho dos funcionários
   */
  carregarDesempenhoFuncionarios(dataInicio?: Date, dataFim?: Date): void {
    this.carregandoDesempenho = true;
    this.erroDesempenho = false;

    this.dashboardService.getDesempenhoFuncionarios(dataInicio, dataFim).subscribe({
      next: (data) => {
        this.desempenhoFuncionarios = data ?? [];
        this.carregandoDesempenho = false;
      },
      error: (error) => {
        console.error('Erro ao carregar desempenho:', error);
        this.erroDesempenho = true;
        this.carregandoDesempenho = false;
      }
    });
  }

  /**
   * Formata tempo em minutos para horas e minutos
   */
  formatarTempo(minutos?: number): string {
    const valor = minutos ?? 0;

    if (valor <= 0) return '0min';

    const horas = Math.floor(valor / 60);
    const mins = Math.round(valor % 60);

    return horas > 0 ? `${horas}h ${mins}min` : `${mins}min`;
  }

  /**
   * Retorna classe CSS baseada no percentual de SLA
   */
  getClasseSLA(): string {
    const sla = this.resumo.percentualSLA ?? 0;

    if (sla >= 90) return 'text-success';
    if (sla >= 70) return 'text-warning';
    return 'text-danger';
  }

  /**
   * Atualiza os dados do dashboard com os filtros aplicados
   */
  atualizarDashboard(): void {
    this.carregarDadosDashboard();
  }

  /**
   * Limpa os filtros e recarrega
   */
  limparFiltros(): void {
    this.definirFiltroInicial();
    this.carregarDadosDashboard();
  }
}
