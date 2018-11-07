import {Routes} from "@angular/router";
import {ProvinciaComponent} from "./provincia/provincia.component";
import {MunicipioComponent} from "./municipio/municipio.component";
import {ConsejoPopularComponent} from "./consejo-popular/consejo-popular.component";
import {TipoDeSuperficieComponent} from "./tipo-de-superficie/tipo-de-superficie.component";
import {TipoDeUsoComponent} from "./tipo-de-uso/tipo-de-uso.component";
import {SolicitudComponent} from "./solicitud/solicitud.component";
import {SolicitanteComponent} from "./solicitante/solicitante.component";
import {ParcelaComponent} from "./parcela/parcela.component";


export const AdminRoutes: Routes = [
    {path: 'provincia', component: ProvinciaComponent},
    {path: 'municipio', component: MunicipioComponent},
    {path: 'consejoPopular', component: ConsejoPopularComponent},
    {path: 'tipoDeSuperficie', component: TipoDeSuperficieComponent},
    {path: 'tipoDeUso', component: TipoDeUsoComponent},
    {path: 'solicitud', component: SolicitudComponent},
    {path: 'solicitante', component: SolicitanteComponent},
    {path: 'parcela', component: ParcelaComponent},
];
