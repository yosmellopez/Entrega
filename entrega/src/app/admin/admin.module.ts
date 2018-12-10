import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {AdminRoutes} from "./admin-routing.module";
import {AngularMaterialModule} from "../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MensajeModule} from "../mensaje/mensaje.module";
import {ProvinciaComponent} from "./provincia/provincia.component";
import {MunicipioComponent} from "./municipio/municipio.component";
import {ConsejoPopularComponent} from "./consejo-popular/consejo-popular.component";
import {SolicitudComponent} from "./solicitud/solicitud.component";
import {SolicitanteComponent} from "./solicitante/solicitante.component";
import {ParcelaComponent} from "./parcela/parcela.component";
import {LineadeproduccionComponent} from "./lineadeproduccion/lineadeproduccion.component";
import {TipoDeSuperficieComponent} from "./tipo-de-superficie/tipo-de-superficie.component";
import {TipoDeUsoComponent} from "./tipo-de-uso/tipo-de-uso.component";
import {ProvinciaWindowComponent} from "./provincia/provincia-window/provincia-window.component";
import {MunicipioWindowComponent} from "./municipio/municipio-window/municipio-window.component";
import {PipesModule} from "../pipes/pipes.module";
import { TipoDeSuperficieWindowComponent } from './tipo-de-superficie/tipo-de-superficie-window/tipo-de-superficie-window.component';
import { TipoDeUsoWindowComponent } from './tipo-de-uso/tipo-de-uso-window/tipo-de-uso-window.component';
import { ConsejoPopularWindowComponent } from './consejo-popular/consejo-popular-window/consejo-popular-window.component';
import { DetallesSolicitudComponent } from './solicitud/detalles-solicitud/detalles-solicitud.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminRoutes),
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        MensajeModule,
        PipesModule
    ],
    declarations: [
        ProvinciaComponent,
        MunicipioComponent,
        MunicipioWindowComponent,
        ConsejoPopularComponent,
        SolicitudComponent,
        SolicitanteComponent,
        ParcelaComponent,
        LineadeproduccionComponent,
        TipoDeSuperficieComponent,
        TipoDeUsoComponent,
        ProvinciaWindowComponent,
        MunicipioWindowComponent,
        TipoDeSuperficieWindowComponent,
        TipoDeUsoWindowComponent,
        ConsejoPopularWindowComponent,
        DetallesSolicitudComponent
    ],
    entryComponents: [ProvinciaWindowComponent, MunicipioWindowComponent, TipoDeSuperficieWindowComponent, TipoDeUsoWindowComponent, ConsejoPopularWindowComponent, DetallesSolicitudComponent]
})
export class AdminModule {
}
