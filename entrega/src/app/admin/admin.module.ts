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
import {ProvinciaPipe} from "../pipes/provincia.pipe";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminRoutes),
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        MensajeModule,

    ],
    declarations: [
        ProvinciaComponent,
        MunicipioComponent,
        ConsejoPopularComponent,
        SolicitudComponent,
        SolicitanteComponent,
        ParcelaComponent,
        LineadeproduccionComponent,
        TipoDeSuperficieComponent,
        TipoDeUsoComponent,
        ProvinciaWindowComponent,
        MunicipioWindowComponent,
        ProvinciaPipe
    ],
    entryComponents: [ProvinciaWindowComponent, MunicipioWindowComponent]
})
export class AdminModule {
}
