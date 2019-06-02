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
import {PersonaDetallesComponent} from "../admin/solicitante/persona-detalles/persona-detalles.component";
import {AdminModule} from "../admin/admin.module";
import { EstadoParcelaWindowComponent } from './tramite/estado-parcela-window/estado-parcela-window.component';
import { ActuParcelaWindowComponent } from './tramite/actu-parcela-window/actu-parcela-window.component';
import { AprobarDenegarLPWindowComponent } from './tramite/aprobar-denegar-lpwindow/aprobar-denegar-lpwindow.component';
import { AprobarDenegarSolicitudWindowsComponent } from './tramite/aprobar-denegar-solicitud-windows/aprobar-denegar-solicitud-windows.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RegitradorRoutes),
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        MensajeModule,
        PipesModule,
        AdminModule
    ],
    declarations:[
        RegulacionComponent,
        BienhechuriasComponent,
        BienhechuriaWindowComponent,
        RegulacionWindowComponent,
        TramiteComponent,
        EstadoParcelaWindowComponent,
        ActuParcelaWindowComponent,
        AprobarDenegarLPWindowComponent,
        AprobarDenegarSolicitudWindowsComponent,
    ],
    entryComponents:[BienhechuriaWindowComponent,RegulacionWindowComponent,PersonaDetallesComponent,EstadoParcelaWindowComponent,ActuParcelaWindowComponent,AprobarDenegarLPWindowComponent,AprobarDenegarSolicitudWindowsComponent]
})
export class RegistradorModule { }
