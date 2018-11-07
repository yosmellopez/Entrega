import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {LoginRoutes} from "./login-routing.module";
import {RegistroComponent} from "./registro/registro.component";
import {InicioComponent} from './inicio/inicio.component';
import {AngularMaterialModule} from "../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LoginRoutes),
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
    ],
    declarations: [RegistroComponent, InicioComponent],
})
export class LoginModule {
}
