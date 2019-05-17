import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularMaterialModule} from "./material.module";
import {AppComponent} from './app.component';
import {SearchBarComponent} from "./components/search-bar/search-bar.component";
import {UserMenuComponent} from "./components/user-menu/user-menu.component";

//servicios
import {HttpClientModule} from "@angular/common/http";

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MensajeModule} from "./mensaje/mensaje.module";
import {LoginComponent} from './components/login/login.component';
import {AppRoutingModule} from "./app-routing";
import {UsuarioComponent} from "./usuario/usuario.component";
import {AdminComponent} from "./admin/admin.component";
import {HeaderComponent} from "./layout/header/header.component";
import {PipesModule} from "./pipes/pipes.module";
import {CentroComponent} from './layout/centro/centro.component';
import {DateFormat} from "./modelo";
import {DateAdapter} from "@angular/material";
import {AdminGuard} from "./guards/admin.guard";
import {UserRouteAccessService} from "./guards/user-route-access-service";
import { LogoutComponent } from './components/logout/logout.component';



@NgModule({
    declarations: [
        AppComponent,
        SearchBarComponent,
        UserMenuComponent,
        UserMenuComponent,
        LoginComponent,
        UsuarioComponent,
        AdminComponent,
        HeaderComponent,
        CentroComponent,
        LogoutComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        RouterModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        MensajeModule,
        PipesModule,
    ],
    providers: [{provide: DateAdapter, useClass: DateFormat}],
    bootstrap: [AppComponent],
    entryComponents: []
})
export class AppModule {
    constructor(private dateAdapter: DateAdapter<Date>) {
        dateAdapter.setLocale('en-in'); // DD/MM/YYYY
    }
}
