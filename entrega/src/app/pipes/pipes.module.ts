import {NgModule} from "@angular/core";
import {ProvinciaPipe} from "./provincia.pipe";
import {TipoSuperficiePipe} from "./tipoDeSuperficie.pipe";
import {MunicipioPipe} from "./municipio.pipe";
import {PersonaPipe} from "./persona.pipe";

@NgModule({
    declarations: [ProvinciaPipe,MunicipioPipe,TipoSuperficiePipe,PersonaPipe],
    exports: [ProvinciaPipe,MunicipioPipe,TipoSuperficiePipe,PersonaPipe]
})
export class PipesModule {

}
