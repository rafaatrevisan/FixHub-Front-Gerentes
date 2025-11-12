import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelatorioTicketsDTO } from '../models/relatorio-tickets.model';
import { environment } from 'src/environments/environment';

export interface FiltrosRelatorio {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  prioridade?: string;
  equipe?: string;
  funcionario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  private baseUrl = `${environment.apiUrl}/api/fixhub/admin/relatorios`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém relatório detalhado de tickets com filtros
   */
  getRelatorioTickets(filtros: FiltrosRelatorio): Observable<RelatorioTicketsDTO[]> {
    let params = new HttpParams();

    if (filtros.dataInicio) {
      params = params.set('dataInicio', filtros.dataInicio);
    }
    if (filtros.dataFim) {
      params = params.set('dataFim', filtros.dataFim);
    }
    if (filtros.status) {
      params = params.set('status', filtros.status);
    }
    if (filtros.prioridade) {
      params = params.set('prioridade', filtros.prioridade);
    }
    if (filtros.equipe) {
      params = params.set('equipe', filtros.equipe);
    }
    if (filtros.funcionario) {
      params = params.set('funcionario', filtros.funcionario);
    }

    return this.http.get<RelatorioTicketsDTO[]>(`${this.baseUrl}/tickets`, { params });
  }

  /**
   * Exporta relatório em formato CSV
   */
  exportarCSV(filtros: FiltrosRelatorio): Observable<Blob> {
    let params = new HttpParams();

    if (filtros.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params = params.set('dataFim', filtros.dataFim);
    if (filtros.status) params = params.set('status', filtros.status);
    if (filtros.prioridade) params = params.set('prioridade', filtros.prioridade);
    if (filtros.equipe) params = params.set('equipe', filtros.equipe);
    if (filtros.funcionario) params = params.set('funcionario', filtros.funcionario);

    return this.http.get(`${this.baseUrl}/tickets/exportar/csv`, {
      params,
      responseType: 'blob'
    });
  }
}
