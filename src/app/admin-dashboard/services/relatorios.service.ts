import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelatorioTicketsDTO } from '../models/relatorio-tickets.model';
import { environment } from '../../environment';

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

  /** Cabeçalho com token JWT */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private formatarDatas(filtros: FiltrosRelatorio): { dataInicio?: string; dataFim?: string } {
    const formatado: any = {};

    if (filtros.dataInicio) {
      formatado.dataInicio = filtros.dataInicio.includes('T')
        ? filtros.dataInicio
        : `${filtros.dataInicio}T00:00:00`;
    }

    if (filtros.dataFim) {
      formatado.dataFim = filtros.dataFim.includes('T')
        ? filtros.dataFim
        : `${filtros.dataFim}T23:59:59`;
    }

    return formatado;
  }

  /** Obtém relatório detalhado de tickets com filtros */
  getRelatorioTickets(filtros: FiltrosRelatorio): Observable<RelatorioTicketsDTO[]> {
    let params = new HttpParams();
    const datas = this.formatarDatas(filtros);

    if (datas.dataInicio) params = params.set('dataInicio', datas.dataInicio);
    if (datas.dataFim) params = params.set('dataFim', datas.dataFim);
    if (filtros.status) params = params.set('status', filtros.status);
    if (filtros.prioridade) params = params.set('prioridade', filtros.prioridade);
    if (filtros.equipe) params = params.set('equipe', filtros.equipe);
    if (filtros.funcionario) params = params.set('funcionario', filtros.funcionario);

    return this.http.get<RelatorioTicketsDTO[]>(`${this.baseUrl}/tickets`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  /** Exporta relatório em formato CSV */
  exportarCSV(filtros: FiltrosRelatorio): Observable<Blob> {
    let params = new HttpParams();
    const datas = this.formatarDatas(filtros);

    if (datas.dataInicio) params = params.set('dataInicio', datas.dataInicio);
    if (datas.dataFim) params = params.set('dataFim', datas.dataFim);
    if (filtros.status) params = params.set('status', filtros.status);
    if (filtros.prioridade) params = params.set('prioridade', filtros.prioridade);
    if (filtros.equipe) params = params.set('equipe', filtros.equipe);
    if (filtros.funcionario) params = params.set('funcionario', filtros.funcionario);

    return this.http.get(`${this.baseUrl}/tickets/exportar/csv`, {
      params,
      responseType: 'blob',
      headers: this.getAuthHeaders()
    });
  }
}
