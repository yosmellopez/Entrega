import {NgModule} from "@angular/core";
import {ProvinciaPipe} from "./provincia.pipe";
import {TipoDeSuperficiePipe} from "./tipoDeSuperficie.pipe";
import {MunicipioPipe} from "./municipio.pipe";

@NgModule({
    declarations: [ProvinciaPipe,MunicipioPipe,TipoDeSuperficiePipe],
    exports: [ProvinciaPipe,MunicipioPipe,TipoDeSuperficiePipe]
})
export class PipesModule {

}
