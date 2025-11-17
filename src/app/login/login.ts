import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email: string = '';  
  senha: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {} 

  login() {
  const body = new HttpParams()
    .set('email', this.email)
    .set('senha', this.senha);

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  this.http.post('https://projeto-integrador-fixhub.onrender.com/api/fixhub/admin/login', body, { headers }).subscribe(
    (response: any) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('nome', response.nome);
      localStorage.setItem('email', response.email);
      localStorage.setItem('cargo', response.cargo);
      this.router.navigate(['/home']);
    },
    (error) => {
      this.errorMessage = 'Email ou senha inválidos';  
    }
  );
}

abrirRecuperacaoSenha(event: Event) {
  event.preventDefault(); 

  Swal.fire({
    title: 'Recuperar senha',
    text: 'Informe o email associado à sua conta:',
    input: 'email',
    inputPlaceholder: 'seuemail@exemplo.com',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#0884c0',
    customClass: {
      popup: 'custom-swal',
      
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Email enviado!',
        text: `Se existir uma conta associada ao email ${result.value}, você receberá instruções para redefinir sua senha.`,
        confirmButtonText: 'OK'
      });
    }
  });
}
}
