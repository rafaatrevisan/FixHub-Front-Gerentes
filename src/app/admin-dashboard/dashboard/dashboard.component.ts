import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardResumoDTO } from '../models/dashboard-resumo.model';
import { GraficoTicketsDTO } from '../models/grafico-tickets.model';
import { DesempenhoFuncionarioDTO } from '../models/desempenho-funcionario.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.carregarDadosDashboard();
  }

  /**
   * Carrega todos os dados do dashboard
   */
  carregarDadosDashboard(): void {
    this.carregarResumo();
    this.carregarGraficos();
    this.carregarDesempenhoFuncionarios();
  }

  /**
   * Carrega o resumo geral
   */
  carregarResumo(): void {
    this.carregandoResumo = true;
    this.erroResumo = false;

    this.dashboardService.getResumo().subscribe({
      next: (data) => {
        this.resumo = data;
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
  carregarGraficos(): void {
    this.carregandoGraficos = true;
    this.erroGraficos = false;

    // Carrega tickets por status
    this.dashboardService.getTicketsPorStatus().subscribe({
      next: (data) => {
        this.ticketsPorStatus = data;
      },
      error: (error) => {
        console.error('Erro ao carregar tickets por status:', error);
        this.erroGraficos = true;
      }
    });

    // Carrega tickets por prioridade
    this.dashboardService.getTicketsPorPrioridade().subscribe({
      next: (data) => {
        this.ticketsPorPrioridade = data;
      },
      error: (error) => {
        console.error('Erro ao carregar tickets por prioridade:', error);
        this.erroGraficos = true;
      }
    });

    // Carrega tickets por equipe
    this.dashboardService.getTicketsPorEquipe().subscribe({
      next: (data) => {
        this.ticketsPorEquipe = data;
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
  carregarDesempenhoFuncionarios(): void {
    this.carregandoDesempenho = true;
    this.erroDesempenho = false;

    this.dashboardService.getDesempenhoFuncionarios().subscribe({
      next: (data) => {
        this.desempenhoFuncionarios = data;
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
  formatarTempo(minutos: number): string {
    if (!minutos) return '0min';
    
    const horas = Math.floor(minutos / 60);
    const mins = Math.round(minutos % 60);
    
    if (horas > 0) {
      return `${horas}h ${mins}min`;
    }
    return `${mins}min`;
  }

  /**
   * Retorna classe CSS baseada no percentual de SLA
   */
  getClasseSLA(): string {
    if (this.resumo.percentualSLA >= 90) return 'text-success';
    if (this.resumo.percentualSLA >= 70) return 'text-warning';
    return 'text-danger';
  }

  /**
   * Atualiza os dados do dashboard
   */
  atualizarDashboard(): void {
    this.carregarDadosDashboard();
  }
}
