import { Injectable } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://projeto-integrador-fixhub.onrender.com/api/fixhub/admin/login';
  
  constructor(private router: Router) {}

  login(username: string, password: string) {
    return axios.post(this.apiUrl, { username, password })
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Erro de autenticação:', error);
        throw error;
      });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
