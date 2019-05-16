import { Routes } from '@angular/router';
import { ProvinciaComponent } from './provincia/provincia.component';
import { MunicipioComponent } from './municipio/municipio.component';
import { ConsejoPopularComponent } from './consejo-popular/consejo-popular.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { SolicitanteComponent } from './solicitante/solicitante.component';
import { ParcelaComponent } from './parcela/parcela.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TipoSuperficieComponent } from './tipo-superficie/tipo-superficie.component';
import { TipoUsoComponent } from './tipo-uso/tipo-uso.component';


export const AdminRoutes: Routes = [
    {path: 'provincia', component: ProvinciaComponent},
    {path: 'municipio', component: MunicipioComponent},
    {path: 'consejoPopular', component: ConsejoPopularComponent},
    {path: 'tipoDeSuperficie', component: TipoSuperficieComponent},
    {path: 'tipoUso', component: TipoUsoComponent},
    {path: 'solicitud', component: SolicitudComponent},
    {path: 'solicitante', component: SolicitanteComponent},
    {path: 'parcela', component: ParcelaComponent},
    {path: 'usuario', component: UsuariosComponent}
];
