import {Routes} from "@angular/router";
import {RegulacionComponent} from "./regulacion/regulacion.component";
import {BienhechuriasComponent} from "./bienhechurias/bienhechurias.component";
import {TramiteComponent} from "./tramite/tramite.component";


export const RegitradorRoutes: Routes =[
    {path:'regulacion', component:RegulacionComponent},
    {path:'bienhechurias', component:BienhechuriasComponent},
    {path:'tramite', component:TramiteComponent}
];
