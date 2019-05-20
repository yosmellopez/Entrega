import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin-routing.module';
import { AngularMaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MensajeModule } from '../mensaje/mensaje.module';
import { ProvinciaComponent } from './provincia/provincia.component';
import { MunicipioComponent } from './municipio/municipio.component';
import { ConsejoPopularComponent } from './consejo-popular/consejo-popular.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { SolicitanteComponent } from './solicitante/solicitante.component';
import { ParcelaComponent } from './parcela/parcela.component';
import { LineadeproduccionComponent } from './lineadeproduccion/lineadeproduccion.component';
import { ProvinciaWindowComponent } from './provincia/provincia-window/provincia-window.component';
import { MunicipioWindowComponent } from './municipio/municipio-window/municipio-window.component';
import { PipesModule } from '../pipes/pipes.module';
import { ConsejoPopularWindowComponent } from './consejo-popular/consejo-popular-window/consejo-popular-window.component';
import { DetallesSolicitudComponent } from './solicitud/detalles-solicitud/detalles-solicitud.component';
import { SolicitudWindowComponent } from './solicitud/solicitud-window/solicitud-window.component';
import { PersonaWindowsComponent } from './solicitante/persona-windows/persona-windows.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioWindowComponent } from './usuarios/usuario-window/usuario-window.component';
import { PersonaAyudaWindowsComponent } from './solicitante/persona-ayuda-windows/persona-ayuda-windows.component';
import { TipoSuperficieComponent } from './tipo-superficie/tipo-superficie.component';
import { TipoUsoComponent } from './tipo-uso/tipo-uso.component';
import { TipoSuperficieWindowComponent } from './tipo-superficie/tipo-de-superficie-window/tipo-superficie-window.component';
import { TipoUsoWindowComponent } from './tipo-uso/tipo-uso-window/tipo-uso-window.component';
import { ParcelaWindow } from './parcela/parcela-window/parcela-window.component';

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
        TipoSuperficieComponent,
        TipoUsoComponent,
        ProvinciaWindowComponent,
        MunicipioWindowComponent,
        TipoSuperficieWindowComponent,
        TipoUsoWindowComponent,
        ConsejoPopularWindowComponent,
        DetallesSolicitudComponent,
        SolicitudWindowComponent,
        PersonaWindowsComponent,
        UsuariosComponent,
        UsuarioWindowComponent,
        PersonaAyudaWindowsComponent,
        ParcelaWindow,
    ],
    entryComponents: [ProvinciaWindowComponent, MunicipioWindowComponent, TipoSuperficieWindowComponent, TipoUsoWindowComponent, ConsejoPopularWindowComponent,
        DetallesSolicitudComponent, SolicitudWindowComponent, PersonaWindowsComponent, UsuarioWindowComponent, ParcelaWindow]
})
export class AdminModule {
}
