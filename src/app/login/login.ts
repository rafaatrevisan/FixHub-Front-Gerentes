import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

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
}
