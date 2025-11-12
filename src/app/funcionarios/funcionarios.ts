import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
  providers: [provideNgxMask()]
})
export class FuncionariosComponent {
  funcionarios: any[] = [];
  filtro = {
    nome: '',
    cargo: '',
    telefone: '',
    email: '',
    ativo: '',
    dataInicioCadastro: '',
    dataFimCadastro: ''
  };
  novoFuncionario: any = {
    nome: '',
    telefone: '',
    dataNascimento: '',
    email: '',
    senha: '',
    cargo: ''
  };
  cargos = ['GERENTE', 'SUPORTE', 'MANUTENCAO', 'LIMPEZA'];
  apiUrl = 'https://projeto-integrador-fixhub.onrender.com/api/fixhub/admin/funcionarios';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarFuncionarios() {
    let params = new HttpParams();

    if (this.filtro.nome) params = params.set('nome', this.filtro.nome);
    if (this.filtro.cargo) params = params.set('cargo', this.filtro.cargo);
    if (this.filtro.telefone) params = params.set('telefone', this.filtro.telefone);
    if (this.filtro.email) params = params.set('email', this.filtro.email);
    if (this.filtro.ativo !== '') params = params.set('ativo', this.filtro.ativo);
    if (this.filtro.dataInicioCadastro) {
      params = params.set('dataInicioCadastro', this.filtro.dataInicioCadastro + 'T00:00:00');
    }
    if (this.filtro.dataFimCadastro) {
      params = params.set('dataFimCadastro', this.filtro.dataFimCadastro + 'T00:00:00');
    }

    this.http.get<any[]>(`${this.apiUrl}/filtro`, { params, headers: this.getAuthHeaders() }).subscribe({
      next: (data) => (this.funcionarios = data),
      error: (err) =>
        Swal.fire({
          title: 'Erro',
          text: err.error?.erro || 'Erro ao buscar funcionários',
          icon: 'error'
        })
    });
  }

  cadastrarFuncionario() {
    const funcionario = { ...this.novoFuncionario };

    if (funcionario.dataNascimento) {
      funcionario.dataNascimento = funcionario.dataNascimento + 'T00:00:00';
    }

    this.http.post(this.apiUrl, funcionario, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        Swal.fire({
          title: 'Sucesso',
          text: 'Funcionário cadastrado!',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary'
          }
        });
        this.novoFuncionario = { nome: '', telefone: '', dataNascimento: '', email: '', senha: '', cargo: '' };
        this.listarFuncionarios();
      },
      error: err => Swal.fire({
        title: 'Erro',
        text: err.error?.erro || err.error?.message || 'Erro ao cadastrar',
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary'
        }
      })
    });
  }

  editarFuncionario(func: any) {
    this.http.put(`${this.apiUrl}/${func.id}`, func, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        Swal.fire({
          title: 'Sucesso',
          text: 'Funcionário editado!',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary'
          }
        });
        this.listarFuncionarios();
      },
      error: err => Swal.fire({
        title: 'Erro',
        text: err.error?.erro || err.error?.message || 'Erro ao editar',
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary'
        }
      })
    });
  }

  desativarFuncionario(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja desativar este funcionário?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, desativar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.http.patch(`${this.apiUrl}/${id}/desativar`, {}, { headers: this.getAuthHeaders() }).subscribe({
          next: () => {
            Swal.fire({
              title: 'Desativado!',
              text: 'Funcionário desativado.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
              }
            });
            this.listarFuncionarios();
          },
          error: err => Swal.fire({
            title: 'Erro',
            text: err.error?.erro || err.error?.message || 'Erro ao desativar',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-secondary'
            }
          })
        });
      }
    });
  }

  reativarFuncionario(id: number) {
    Swal.fire({
      title: 'Reativar funcionário?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, reativar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.http.patch(`${this.apiUrl}/${id}/reativar`, {}, { headers: this.getAuthHeaders() }).subscribe({
          next: () => {
            Swal.fire({
              title: 'Reativado!',
              text: 'Funcionário reativado.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
              }
            });
            this.listarFuncionarios();
          },
          error: err => Swal.fire({
            title: 'Erro',
            text: err.error?.erro || err.error?.message || 'Erro ao reativar',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-secondary'
            }
          })
        });
      }
    });
  }
}
