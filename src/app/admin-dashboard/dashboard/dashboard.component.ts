import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardResumoDTO } from '../models/dashboard-resumo.model';
import { GraficoTicketsDTO } from '../models/grafico-tickets.model';
import { DesempenhoFuncionarioDTO } from '../models/desempenho-funcionario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
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

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.carregarDadosDashboard();
  }

  /**
   * Tira acentos e converte tudo para minúsculo
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
  carregarGraficos(): void {
    this.carregandoGraficos = true;
    this.erroGraficos = false;

    // Tickets por Status
    this.dashboardService.getTicketsPorStatus().subscribe({
      next: (data) => {
        this.ticketsPorStatus = data ?? [];
      },
      error: (error) => {
        console.error('Erro ao carregar tickets por status:', error);
        this.erroGraficos = true;
      }
    });

    // Tickets por Prioridade
    this.dashboardService.getTicketsPorPrioridade().subscribe({
      next: (data) => {
        this.ticketsPorPrioridade = data ?? [];
      },
      error: (error) => {
        console.error('Erro ao carregar tickets por prioridade:', error);
        this.erroGraficos = true;
      }
    });

    // Tickets por Equipe
    this.dashboardService.getTicketsPorEquipe().subscribe({
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
  carregarDesempenhoFuncionarios(): void {
    this.carregandoDesempenho = true;
    this.erroDesempenho = false;

    this.dashboardService.getDesempenhoFuncionarios().subscribe({
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
   * Atualiza os dados do dashboard
   */
  atualizarDashboard(): void {
    this.carregarDadosDashboard();
  }
}
