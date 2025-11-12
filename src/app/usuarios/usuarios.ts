import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
  providers: [provideNgxMask()]
})
export class UsuariosComponent {
  usuarios: any[] = [];
  filtro = {
    nome: '',
    telefone: '',
    email: '',
    ativo: '',
    dataInicioCadastro: '',
    dataFimCadastro: ''
  };
  apiUrl = 'https://projeto-integrador-fixhub.onrender.com/api/fixhub/admin/usuarios';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarUsuarios() {
    let params = new HttpParams();

    if (this.filtro.nome) params = params.set('nome', this.filtro.nome);
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
      next: data => {
        this.usuarios = data.map(u => ({
          ...u,
          dataNascimento: u.dataNascimento ? u.dataNascimento.split('T')[0] : ''
        }));
      },
      error: err => Swal.fire({
        title: 'Erro',
        text: err.error?.erro || err.error?.message || 'Erro ao buscar usuários',
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary'
        }
      })
    });
  }


  editarUsuario(usuario: any) {
    this.http.put(`${this.apiUrl}/${usuario.id}`, usuario, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        Swal.fire({
          title: 'Sucesso',
          text: 'Usuário editado!',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary'
          }
        });
        this.listarUsuarios();
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

  desativarUsuario(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja desativar este usuário?',
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
              text: 'Usuário desativado.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
              }
            });
            this.listarUsuarios();
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

  reativarUsuario(id: number) {
    Swal.fire({
      title: 'Reativar usuário?',
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
              text: 'Usuário reativado.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
              }
            });
            this.listarUsuarios();
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