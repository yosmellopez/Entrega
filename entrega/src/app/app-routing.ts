import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {UsuarioComponent} from "./usuario/usuario.component";
import {AdminComponent} from "./admin/admin.component";
import {LoginComponent} from "./components/login/login.component";

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {
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
