import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResumoDTO } from '../models/dashboard-resumo.model';
import { GraficoTicketsDTO } from '../models/grafico-tickets.model';
import { DesempenhoFuncionarioDTO } from '../models/desempenho-funcionario.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/api/fixhub/admin/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Cabeçalho com token JWT de autenticação
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Cria os parâmetros de data para as requisições
   */
  private criarParametrosData(dataInicio?: Date, dataFim?: Date): HttpParams {
    let params = new HttpParams();

    if (dataInicio) {
      const dataInicioISO = dataInicio.toISOString();
      params = params.set('dataInicio', dataInicioISO);
    }

    if (dataFim) {
      // Adiciona 23:59:59 para pegar todo o dia
      const dataFimAjustada = new Date(dataFim);
      dataFimAjustada.setHours(23, 59, 59, 999);
      const dataFimISO = dataFimAjustada.toISOString();
      params = params.set('dataFim', dataFimISO);
    }

    return params;
  }

  /**
   * Obtém o resumo geral do dashboard
   */
  getResumo(dataInicio?: Date, dataFim?: Date): Observable<DashboardResumoDTO> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<DashboardResumoDTO>(`${this.baseUrl}/resumo`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Obtém dados para gráfico de tickets por status
   */
  getTicketsPorStatus(dataInicio?: Date, dataFim?: Date): Observable<GraficoTicketsDTO[]> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<GraficoTicketsDTO[]>(`${this.baseUrl}/tickets/status`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Obtém dados para gráfico de tickets por prioridade
   */
  getTicketsPorPrioridade(dataInicio?: Date, dataFim?: Date): Observable<GraficoTicketsDTO[]> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<GraficoTicketsDTO[]>(`${this.baseUrl}/tickets/prioridade`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Obtém dados para gráfico de tickets por equipe
   */
  getTicketsPorEquipe(dataInicio?: Date, dataFim?: Date): Observable<GraficoTicketsDTO[]> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<GraficoTicketsDTO[]>(`${this.baseUrl}/tickets/equipe`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Obtém desempenho dos funcionários
   */
  getDesempenhoFuncionarios(dataInicio?: Date, dataFim?: Date): Observable<DesempenhoFuncionarioDTO[]> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<DesempenhoFuncionarioDTO[]>(`${this.baseUrl}/funcionarios/desempenho`, {
      params,
      headers: this.getAuthHeaders()
    });
  }
}
