import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularMaterialModule} from "./material.module";

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import {ProvinciaComponent} from "./components/provincia/provincia.component";
import {MunicipioComponent} from "./components/municipio/municipio.component";
import {ConsejoPopularComponent} from "./components/consejo-popular/consejo-popular.component";
import {SolicitudComponent} from "./components/solicitud/solicitud.component";
import {SolicitanteComponent} from "./components/solicitante/solicitante.component";
import {ParcelaComponent} from "./components/parcela/parcela.component";
import {LineadeproduccionComponent} from "./components/lineadeproduccion/lineadeproduccion.component";
import {SearchBarComponent} from "./components/search-bar/search-bar.component";
import {UserMenuComponent} from "./components/user-menu/user-menu.component";

//servicios
import {HttpClientModule} from "@angular/common/http";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule, Routes} from "@angular/router";
import {TipoDeSuperficieComponent} from "./components/tipo-de-superficie/tipo-de-superficie.component";
import {TipoDeUsoComponent} from "./components/tipo-de-uso/tipo-de-uso.component";
import {ProvinciaWindowComponent} from "./components/provincia/provincia-window/provincia-window.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MensajeModule} from "./mensaje/mensaje.module";
import { LoginComponent } from './components/login/login.component';
import {MunicipioWindowComponent} from "./components/municipio/municipio-window/municipio-window.component";


const rutas: Routes = [
  {path:'inicial',component:AppComponent},
  {path: 'provincia', component: ProvinciaComponent},
  {path: 'municipio', component: MunicipioComponent},
  {path: 'consejoPopular', component: ConsejoPopularComponent},
  {path: 'tipoDeSuperficie', component: TipoDeSuperficieComponent},
  {path: 'tipoDeUso', component: TipoDeUsoComponent},
  {path: 'solicitud', component: SolicitudComponent},
  {path: 'solicitante', component: SolicitanteComponent},
  {path: 'parcela', component: ParcelaComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', pathMatch:'full',redirectTo:'inicial'}
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProvinciaComponent,
    MunicipioComponent,
    ConsejoPopularComponent,
    SolicitudComponent,
    SolicitanteComponent,
    ParcelaComponent,
    LineadeproduccionComponent,
    TipoDeSuperficieComponent,
    TipoDeUsoComponent,
    SearchBarComponent,
    UserMenuComponent,
    ProvinciaWindowComponent,
    LoginComponent,
    MunicipioWindowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    RouterModule,
    RouterModule.forRoot(rutas),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MensajeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[ProvinciaWindowComponent]
})
export class AppModule { }
