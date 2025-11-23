import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.LoginComponent),
        canActivate: [AuthGuard],
        data: { loginGuard: true }
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.HomeComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'navbar',
        loadComponent: () => import('./navbar/navbar').then(m => m.NavbarComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'funcionarios',
        loadComponent: () => import('./funcionarios/funcionarios').then(m => m.FuncionariosComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'funcionarios/cadastrar',
        loadComponent: () => import('./funcionarios/cadastrar-funcionario/cadastrar-funcionario').then(m => m.CadastrarFuncionarioComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'usuarios',
        loadComponent: () => import('./usuarios/usuarios').then(m => m.UsuariosComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-dashboard/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }