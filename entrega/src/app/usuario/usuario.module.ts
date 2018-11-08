import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {UsuarioRoutes} from "./usuario-routing.module";
import {InicioComponent} from './inicio/inicio.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UsuarioRoutes)
    ],
    declarations: [InicioComponent]
})
export class UsuarioModule {
}
