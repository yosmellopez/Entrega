import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {UsuarioComponent} from './usuario/usuario.component';
import {AdminComponent} from './admin/admin.component';
import {LoginComponent} from './components/login/login.component';
import {RouteInfo} from './modelo';
import {AdminGuard} from "./guards/admin.guard";
import {UserRouteAccessService} from "./guards/user-route-access-service";

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {
        path: '',
        component: UsuarioComponent,
        children: [{path: 'usuario', loadChildren: './usuario/usuario.module#UsuarioModule'}],
        canActivate: [UserRouteAccessService],
        data:{
            roles:['Registrador','Administrador']
        }
    }, {
        path: '',
        component: AdminComponent,
        children: [{path: 'admin', loadChildren: './admin/admin.module#AdminModule'}],
        canActivate: [AdminGuard],
        data: {
            roles: ['Administrador']
        }
    }
];

export const APP_RUTAS: RouteInfo[] = [{
        id: 'registrador-actions',
        title: 'Gestión',
        icon: '',
        class: 'zmdi zmdi-accounts-alt',
        authority: ['Registrador', 'Administrador'],
        hasChildren: true,
        path: '',
        routes:[{
            path: '/admin/solicitud',
            title: 'Solicitud',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/solicitante',
            title: 'Solicitante',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/parcela',
            title: 'Parcelas',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }]
    },{
        id: 'admin-actions',
        title: 'Administración',
        icon: 'group',
        class: 'zmdi zmdi-accounts-alt',
        authority: ['Administrador'],
        hasChildren: true,
        path: '',
        routes: [{
            path:'/admin/usuario',
            title:'Usuario',
            icon:'',
            class:'waves-effect waves-cyan',
        }]
    }, {
        id: 'nomencladores',
        title: 'Nomencladores',
        icon: 'gps_fixed',
        class: 'zmdi zmdi-accounts-alt',
        hasChildren: true,
        path: '',
        authority: ['Administrador'],
        routes: [{
            path: '/admin/provincia',
            title: 'Provincias',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/municipio',
            title: 'Municipios',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/consejoPopular',
            title: 'Consejos Populares',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/tipoDeSuperficie',
            title: 'Tipos de Superficies',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/tipoDeUso',
            title: 'Tipo de Uso',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }]
    }];


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule {
}
