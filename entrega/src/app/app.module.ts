import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularMaterialModule} from "./material.module";

import {AppComponent} from './app.component';

import {MunicipioComponent} from "./admin/municipio/municipio.component";
import {SearchBarComponent} from "./components/search-bar/search-bar.component";
import {UserMenuComponent} from "./components/user-menu/user-menu.component";

//servicios
import {HttpClientModule} from "@angular/common/http";

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MensajeModule} from "./mensaje/mensaje.module";
import {LoginComponent} from './components/login/login.component';
import {MunicipioWindowComponent} from "./admin/municipio/municipio-window/municipio-window.component";
import {ProvinciaPipe} from './pipes/provincia.pipe';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";


const rutas: Routes = [
    {path: 'inicial', component: AppComponent},
    {path: 'municipio', component: MunicipioComponent},
    {path: 'login', component: LoginComponent},
    {path: '**', pathMatch: 'full', redirectTo: 'inicial'}
];


@NgModule({
    declarations: [
        AppComponent,
        MunicipioComponent,
        SearchBarComponent,
        UserMenuComponent,
        LoginComponent,
        MunicipioWindowComponent,
        ProvinciaPipe
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
        MensajeModule,
        NgxMatSelectSearchModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [MunicipioWindowComponent]
})
export class AppModule {
}
