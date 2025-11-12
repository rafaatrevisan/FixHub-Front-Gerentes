import { Component, OnInit } from '@angular/core';
import { RelatoriosService, FiltrosRelatorio } from '../services/relatorios.service';
import { RelatorioTicketsDTO } from '../models/relatorio-tickets.model';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
  // Lista de tickets
  tickets: RelatorioTicketsDTO[] = [];

  // Filtros
  filtros: FiltrosRelatorio = {
    dataInicio: '',
    dataFim: '',
    status: '',
    prioridade: '',
    equipe: '',
    funcionario: ''
  };

  // Opções para os selects
  statusOptions = ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO'];
  prioridadeOptions = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];
  equipeOptions = ['SUPORTE', 'TI', 'INFRAESTRUTURA', 'DESENVOLVIMENTO'];

  // Estados
  carregando = false;
  erro = false;
  mensagemErro = '';

  // Paginação e ordenação
  paginaAtual = 1;
  itensPorPagina = 10;
  ticketsFiltrados: RelatorioTicketsDTO[] = [];

  constructor(private relatoriosService: RelatoriosService) {}

  ngOnInit(): void {
    this.definirDatasIniciais();
    this.buscarRelatorio();
  }

  /**
   * Define datas iniciais (último mês)
   */
  definirDatasIniciais(): void {
    const hoje = new Date();
    const umMesAtras = new Date();
    umMesAtras.setMonth(hoje.getMonth() - 1);

    this.filtros.dataFim = this.formatarData(hoje);
    this.filtros.dataInicio = this.formatarData(umMesAtras);
  }

  /**
   * Formata data para yyyy-MM-dd
   */
  formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  /**
   * Busca relatório com os filtros aplicados
   */
  buscarRelatorio(): void {
    this.carregando = true;
    this.erro = false;
    this.mensagemErro = '';

    this.relatoriosService.getRelatorioTickets(this.filtros).subscribe({
      next: (data) => {
        this.tickets = data;
        this.ticketsFiltrados = data;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao buscar relatório:', error);
        this.erro = true;
        this.mensagemErro = 'Erro ao carregar relatório. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  /**
   * Limpa todos os filtros
   */
  limparFiltros(): void {
    this.filtros = {
      dataInicio: '',
      dataFim: '',
      status: '',
      prioridade: '',
      equipe: '',
      funcionario: ''
    };
    this.definirDatasIniciais();
    this.buscarRelatorio();
  }

  /**
   * Exporta relatório em CSV
   */
  exportarCSV(): void {
    this.relatoriosService.exportarCSV(this.filtros).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio_tickets_${new Date().getTime()}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao exportar CSV:', error);
        alert('Erro ao exportar relatório');
      }
    });
  }

  /**
   * Formata data para exibição
   */
  formatarDataExibicao( string): string {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  }

  /**
   * Retorna classe CSS baseada no status
   */
  getClasseStatus(status: string): string {
    const classes: any = {
      'ABERTO': 'status-aberto',
      'EM_ANDAMENTO': 'status-andamento',
      'RESOLVIDO': 'status-resolvido',
      import { Component, OnInit } from '@angular/core';
import { RelatoriosService, FiltrosRelatorio } from '../services/relatorios.service';
import { RelatorioTicketsDTO } from '../models/relatorio-tickets.model';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
  // Lista de tickets
  tickets: RelatorioTicketsDTO[] = [];

  // Filtros
  filtros: FiltrosRelatorio = {
    dataInicio: '',
    dataFim: '',
    status: '',
    prioridade: '',
    equipe: '',
    funcionario: ''
  };

  // Opções para os selects
  statusOptions = ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO'];
  prioridadeOptions = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];
  equipeOptions = ['SUPORTE', 'TI', 'INFRAESTRUTURA', 'DESENVOLVIMENTO'];

  // Estados
  carregando = false;
  erro = false;
  mensagemErro = '';

  // Paginação e ordenação
  paginaAtual = 1;
  itensPorPagina = 10;
  ticketsFiltrados: RelatorioTicketsDTO[] = [];

  constructor(private relatoriosService: RelatoriosService) {}

  ngOnInit(): void {
    this.definirDatasIniciais();
    this.buscarRelatorio();
  }

  /**
   * Define datas iniciais (último mês)
   */
  definirDatasIniciais(): void {
    const hoje = new Date();
    const umMesAtras = new Date();
    umMesAtras.setMonth(hoje.getMonth() - 1);

    this.filtros.dataFim = this.formatarData(hoje);
    this.filtros.dataInicio = this.formatarData(umMesAtras);
  }

  /**
   * Formata data para yyyy-MM-dd
   */
  formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  /**
   * Busca relatório com os filtros aplicados
   */
  buscarRelatorio(): void {
    this.carregando = true;
    this.erro = false;
    this.mensagemErro = '';

    this.relatoriosService.getRelatorioTickets(this.filtros).subscribe({
      next: (data) => {
        this.tickets = data;
        this.ticketsFiltrados = data;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao buscar relatório:', error);
        this.erro = true;
        this.mensagemErro = 'Erro ao carregar relatório. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  /**
   * Limpa todos os filtros
   */
  limparFiltros(): void {
    this.filtros = {
      dataInicio: '',
      dataFim: '',
      status: '',
      prioridade: '',
      equipe: '',
      funcionario: ''
    };
    this.definirDatasIniciais();
    this.buscarRelatorio();
  }

  /**
   * Exporta relatório em CSV
   */
  exportarCSV(): void {
    this.relatoriosService.exportarCSV(this.filtros).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio_tickets_${new Date().getTime()}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao exportar CSV:', error);
        alert('Erro ao exportar relatório');
      }
    });
  }

  /**
   * Formata data para exibição
   */
  formatarDataExibicao( string): string {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  }

  /**
   * Retorna classe CSS baseada no status
   */
  getClasseStatus(status: string): string {
    const classes: any = {
      'ABERTO': 'status-aberto',
      'EM_ANDAMENTO': 'status-andamento',
      'RESOLVIDO': 'status-resolvido',
            'FECHADO': 'status-fechado'
    };
    return classes[status] || 'status-default';
  }

  /**
   * Retorna classe CSS baseada na prioridade
   */
  getClassePrioridade(prioridade: string): string {
    const classes: any = {
      'BAIXA': 'priority-baixa',
      'MEDIA': 'priority-media',
      'ALTA': 'priority-alta',
      'URGENTE': 'priority-urgente'
    };
    return classes[prioridade] || 'priority-default';
  }

  /**
   * Formata tempo em minutos
   */
  formatarTempo(minutos: number): string {
    if (!minutos) return '-';
    
    const horas = Math.floor(minutos / 60);
    const mins = Math.round(minutos % 60);
    
    if (horas > 0) {
      return `${horas}h ${mins}min`;
    }
    return `${mins}min`;
  }

  /**
   * Retorna tickets da página atual
   */
  getTicketsPaginados(): RelatorioTicketsDTO[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.ticketsFiltrados.slice(inicio, fim);
  }

  /**
   * Retorna número total de páginas
   */
  getTotalPaginas(): number {
    return Math.ceil(this.ticketsFiltrados.length / this.itensPorPagina);
  }

  /**
   * Vai para página anterior
   */
  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  /**
   * Vai para próxima página
   */
  proximaPagina(): void {
    if (this.paginaAtual < this.getTotalPaginas()) {
      this.paginaAtual++;
    }
  }

  /**
   * Vai para uma página específica
   */
  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.getTotalPaginas()) {
      this.paginaAtual = pagina;
    }
  }

  /**
   * Retorna array de páginas para paginação
   */
  getPaginas(): number[] {
    const total = this.getTotalPaginas();
    const paginas: number[] = [];
    const maxPaginas = 5;
    
    let inicio = Math.max(1, this.paginaAtual - Math.floor(maxPaginas / 2));
    let fim = Math.min(total, inicio + maxPaginas - 1);
    
    if (fim - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fim - maxPaginas + 1);
    }
    
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }
}