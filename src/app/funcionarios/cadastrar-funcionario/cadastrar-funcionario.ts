import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastrar-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './cadastrar-funcionario.html',
  styleUrl: './cadastrar-funcionario.css',
  providers: [provideNgxMask()] 
})
export class CadastrarFuncionarioComponent {
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

  constructor(private http: HttpClient, public router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  cadastrarFuncionario() {
    this.http.post(this.apiUrl, this.novoFuncionario, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        Swal.fire({
          title: 'Sucesso',
          text: 'Funcionário cadastrado!',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary'
          }
        }).then(() => {
          this.router.navigate(['/funcionarios']);
        });
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
}
