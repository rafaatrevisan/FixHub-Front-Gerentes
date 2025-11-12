import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../admin-dashboard/services/dashboard.service';
import { DashboardResumoDTO } from '../admin-dashboard/models/dashboard-resumo.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  
  // Usuário logado
  usuarioLogado: any = null;

  // Resumo geral do sistema
  resumoGeral: DashboardResumoDTO | null = null;

  // Estados
  carregando = true;
  erro = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.carregarUsuarioLogado();
    this.carregarResumoGeral();
  }

  /**
   * Carrega informações do usuário logado
   */
  carregarUsuarioLogado(): void {
    // Busca do localStorage ou serviço de autenticação
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuarioLogado = JSON.parse(usuarioStorage);
    } else {
      this.usuarioLogado = {
        nome: 'Usuário',
        cargo: 'Visitante'
      };
    }
  }

  /**
   * Carrega resumo geral do sistema
   */
  carregarResumoGeral(): void {
    this.carregando = true;
    this.erro = false;

    this.dashboardService.getResumo().subscribe({
      next: (data) => {
        this.resumoGeral = data;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        this.erro = true;
        this.carregando = false;
        // Define valores padrão em caso de erro
        this.resumoGeral = {
          totalTickets: 0,
          ticketsAbertos: 0,
          ticketsEmAndamento: 0,
          ticketsResolvidos: 0,
          tempoMedioResolucao: 0,
          percentualSLA: 0
        };
      }
    });
  }
}
