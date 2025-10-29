import { Component } from '@angular/core';
import { AuthService } from '../auth';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
