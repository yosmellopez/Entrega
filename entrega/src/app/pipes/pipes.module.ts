import {NgModule} from "@angular/core";
import {ProvinciaPipe} from "./provincia.pipe";
import {TipoDeSuperficiePipe} from "./tipoDeSuperficie.pipe";

@NgModule({
    declarations: [ProvinciaPipe,TipoDeSuperficiePipe],
    exports: [ProvinciaPipe,TipoDeSuperficiePipe]
})
export class PipesModule {

}
