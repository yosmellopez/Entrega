import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {UsuarioComponent} from "./usuario/usuario.component";
import {AdminComponent} from "./admin/admin.component";
import {LoginComponent} from "./components/login/login.component";
import {RouteInfo} from "./modelo";

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {
        path: '',
        component: UsuarioComponent,
        children: [{path: 'usuario', loadChildren: './usuario/usuario.module#UsuarioModule'}]
    }, {
        path: '',
        component: AdminComponent,
        children: [{path: 'admin', loadChildren: './admin/admin.module#AdminModule'}]
    }
];
export const APP_RUTAS: RouteInfo[] = [
    {
        id: "admin-actions",
        title: "Administración",
        icon: "group",
        class: "zmdi zmdi-accounts-alt",
        authority: ["Administrador"],
        hasChildren: true,
        path: "",
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
            title: 'Conseejos Populares',
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
        }, {
            path: '/admin/solicitud',
            title: 'usuario.list',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/solicitante',
            title: 'usuario.list',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/parcela',
            title: 'usuario.list',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }]
    }, {
        id: "user-actions",
        title: "gpsTravel",
        icon: "gps_fixed",
        class: "tag tag-rounded tag-success tag-sm",
        hasChildren: true,
        path: "",
        authority: ["Usuario", "Administrador"],
        routes: [{
            path: '/user/bus-list',
            title: 'bus.list',
            icon: 'directions_bus',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/user/place-list',
            title: 'place.list',
            icon: 'place',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/user/route-list',
            title: 'route.list',
            icon: 'directions',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/user/travel-list',
            title: 'travel.list',
            icon: 'airplanemode_active',
            class: 'waves-effect waves-cyan',
        }]
    }, {
        id: "user-profile",
        path: '/user/profile',
        title: 'userprofile',
        icon: 'person',
        class: 'tag tag-rounded tag-danger tag-sm',
        authority: ["Administrador", "Usuario"],
        hasChildren: false,
        routes: [],
    }, {
        id: "notifications",
        path: '/user/notification',
        title: 'notifications',
        icon: 'notifications',
        class: 'tag tag-rounded tag-danger tag-sm',
        authority: ["Administrador", "Usuario"],
        hasChildren: false,
        routes: [],
    }
];


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule {
}
