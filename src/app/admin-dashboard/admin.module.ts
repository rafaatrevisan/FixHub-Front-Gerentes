import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { DashboardService } from './services/dashboard.service';
import { RelatoriosService } from './services/relatorios.service';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'relatorios', component: RelatoriosComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    DashboardComponent,
    RelatoriosComponent
  ],
  providers: [
    DashboardService,
    RelatoriosService
  ]
})
export class AdminModule { }
