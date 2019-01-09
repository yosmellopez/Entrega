import {NgModule} from "@angular/core";
import {ProvinciaPipe} from "./provincia.pipe";
import {TipoDeSuperficiePipe} from "./tipoDeSuperficie.pipe";
import {MunicipioPipe} from "./municipio.pipe";
import {PersonaPipe} from "./persona.pipe";

@NgModule({
    declarations: [ProvinciaPipe,MunicipioPipe,TipoDeSuperficiePipe,PersonaPipe],
    exports: [ProvinciaPipe,MunicipioPipe,TipoDeSuperficiePipe,PersonaPipe]
})
export class PipesModule {

}
