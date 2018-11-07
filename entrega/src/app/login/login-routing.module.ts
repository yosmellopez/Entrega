import {Routes} from '@angular/router';
import {RegistroComponent} from "./registro/registro.component";
import {InicioComponent} from "./inicio/inicio.component";

export const LoginRoutes: Routes = [
    {path: 'login', component: InicioComponent},
    {path: 'registro', component: RegistroComponent},
];
