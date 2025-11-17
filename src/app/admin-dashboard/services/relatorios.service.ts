import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelatorioTicketsDTO } from '../models/relatorio-tickets.model';
import { environment } from '../../environment';

export interface FiltrosRelatorio {
  dataInicio?: string;
  dataFim?: string;
  status?: string[];       // ALTERADO: string → string[]
  prioridade?: string[];   // ALTERADO: string → string[]
  equipe?: string[];       // ALTERADO: string → string[]
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

  /**
   * Converte array para string separada por vírgulas
   * ["PENDENTE", "EM_ANDAMENTO"] → "PENDENTE,EM_ANDAMENTO"
   */
  private converterArrayParaString(array?: string[]): string {
    if (!array || array.length === 0) return '';
    return array.join(',');
  }

  /** Obtém relatório detalhado de tickets com filtros */
  getRelatorioTickets(filtros: FiltrosRelatorio): Observable<RelatorioTicketsDTO[]> {
    let params = new HttpParams();
    const datas = this.formatarDatas(filtros);

    if (datas.dataInicio) params = params.set('dataInicio', datas.dataInicio);
    if (datas.dataFim) params = params.set('dataFim', datas.dataFim);
    
    // Converte arrays para strings separadas por vírgula
    if (filtros.status && filtros.status.length > 0) {
      params = params.set('status', this.converterArrayParaString(filtros.status));
    }
    if (filtros.prioridade && filtros.prioridade.length > 0) {
      params = params.set('prioridade', this.converterArrayParaString(filtros.prioridade));
    }
    if (filtros.equipe && filtros.equipe.length > 0) {
      params = params.set('equipe', this.converterArrayParaString(filtros.equipe));
    }
    if (filtros.funcionario) {
      params = params.set('funcionario', filtros.funcionario);
    }

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
    
    if (filtros.status && filtros.status.length > 0) {
      params = params.set('status', this.converterArrayParaString(filtros.status));
    }
    if (filtros.prioridade && filtros.prioridade.length > 0) {
      params = params.set('prioridade', this.converterArrayParaString(filtros.prioridade));
    }
    if (filtros.equipe && filtros.equipe.length > 0) {
      params = params.set('equipe', this.converterArrayParaString(filtros.equipe));
    }
    if (filtros.funcionario) {
      params = params.set('funcionario', filtros.funcionario);
    }

    return this.http.get(`${this.baseUrl}/tickets/exportar/csv`, {
      params,
      responseType: 'blob',
      headers: this.getAuthHeaders()
    });
  }
}
