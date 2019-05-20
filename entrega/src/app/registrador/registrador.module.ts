import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegulacionComponent } from './regulacion/regulacion.component';
import { BienhechuriasComponent } from './bienhechurias/bienhechurias.component';
import {MensajeModule} from "../mensaje/mensaje.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PipesModule} from "../pipes/pipes.module";
import {RouterModule} from "@angular/router";
import {AngularMaterialModule} from "../material.module";
import {RegitradorRoutes} from "./registrador-routing.module";
import { BienhechuriaWindowComponent } from './bienhechurias/bienhechuria-window/bienhechuria-window.component';
import { RegulacionWindowComponent } from './regulacion/regulacion-window/regulacion-window.component';
import { TramiteComponent } from './tramite/tramite.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RegitradorRoutes),
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        MensajeModule,
        PipesModule
    ],
    declarations: [
        RegulacionComponent,
        BienhechuriasComponent,
        BienhechuriaWindowComponent,
        RegulacionWindowComponent,
        TramiteComponent
    ],
    entryComponents:[BienhechuriaWindowComponent,RegulacionWindowComponent]
})
export class RegistradorModule { }
