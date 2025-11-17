import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResumoDTO } from '../models/dashboard-resumo.model';
import { GraficoTicketsDTO } from '../models/grafico-tickets.model';
import { DesempenhoFuncionarioDTO } from '../models/desempenho-funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'https://projeto-integrador-fixhub.onrender.com/api/fixhub/admin/dashboard';

  constructor(private http: HttpClient) { }

  /**
   * Cria os parâmetros de data para as requisições
   */
  private criarParametrosData(dataInicio?: Date, dataFim?: Date): HttpParams {
    let params = new HttpParams();

    if (dataInicio) {
      params = params.set('dataInicio', dataInicio.toISOString());
    }

    if (dataFim) {
      params = params.set('dataFim', dataFim.toISOString());
    }

    return params;
  }

  /**
   * Obtém o resumo geral do dashboard
   */
  getResumo(dataInicio?: Date, dataFim?: Date): Observable<DashboardResumoDTO> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<DashboardResumoDTO>(`${this.baseUrl}/resumo`, { params });
  }

  /**
   * Obtém dados para gráfico de tickets por status
   */
  getTicketsPorStatus(dataInicio?: Date, dataFim?: Date): Observable<GraficoTicketsDTO[]> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<GraficoTicketsDTO[]>(`${this.baseUrl}/tickets/status`, { params });
  }

  /**
   * Obtém dados para gráfico de tickets por prioridade
   */
  getTicketsPorPrioridade(dataInicio?: Date, dataFim?: Date): Observable<GraficoTicketsDTO[]> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<GraficoTicketsDTO[]>(`${this.baseUrl}/tickets/prioridade`, { params });
  }

  /**
   * Obtém dados para gráfico de tickets por equipe
   */
  getTicketsPorEquipe(dataInicio?: Date, dataFim?: Date): Observable<GraficoTicketsDTO[]> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<GraficoTicketsDTO[]>(`${this.baseUrl}/tickets/equipe`, { params });
  }

  /**
   * Obtém desempenho dos funcionários
   */
  getDesempenhoFuncionarios(dataInicio?: Date, dataFim?: Date): Observable<DesempenhoFuncionarioDTO[]> {
    const params = this.criarParametrosData(dataInicio, dataFim);
    return this.http.get<DesempenhoFuncionarioDTO[]>(`${this.baseUrl}/funcionarios/desempenho`, { params });
  }
}
