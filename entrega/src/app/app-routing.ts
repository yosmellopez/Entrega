import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {LoginComponent} from "./login/login.component";
import {UsuarioComponent} from "./usuario/usuario.component";
import {AdminComponent} from "./admin/admin.component";

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {
        path: '',
        component: LoginComponent,
        children: [{path: '', loadChildren: './login/login.module#LoginModule'}]
    }, {
        path: '',
        component: UsuarioComponent,
        children: [{path: '', loadChildren: './usuario/usuario.module#UsuarioModule'}]
    }, {
        path: '',
        component: AdminComponent,
        children: [{path: 'admin', loadChildren: './admin/admin.module#AdminModule'}]
    }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: []
})
export class AppRoutingModule {
}
