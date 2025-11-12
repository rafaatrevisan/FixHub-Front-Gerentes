import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResumoDTO } from '../models/dashboard-resumo.model';
import { GraficoTicketsDTO } from '../models/grafico-tickets.model';
import { DesempenhoFuncionarioDTO } from '../models/desempenho-funcionario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/api/fixhub/admin/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém o resumo geral do dashboard
   */
  getResumo(): Observable<DashboardResumoDTO> {
    return this.http.get<DashboardResumoDTO>(`${this.baseUrl}/resumo`);
  }

  /**
   * Obtém dados para gráfico de tickets por status
   */
  getTicketsPorStatus(): Observable<GraficoTicketsDTO[]> {
    return this.http.get<GraficoTicketsDTO[]>(`${this.baseUrl}/tickets/status`);
  }

  /**
   * Obtém dados para gráfico de tickets por prioridade
   */
  getTicketsPorPrioridade(): Observable<GraficoTicketsDTO[]> {
    return this.http.get<GraficoTicketsDTO[]>(`${this.baseUrl}/tickets/prioridade`);
  }

  /**
   * Obtém dados para gráfico de tickets por equipe
   */
  getTicketsPorEquipe(): Observable<GraficoTicketsDTO[]> {
    return this.http.get<GraficoTicketsDTO[]>(`${this.baseUrl}/tickets/equipe`);
  }

  /**
   * Obtém desempenho dos funcionários
   */
  getDesempenhoFuncionarios(): Observable<DesempenhoFuncionarioDTO[]> {
    return this.http.get<DesempenhoFuncionarioDTO[]>(`${this.baseUrl}/funcionarios/desempenho`);
  }
}
