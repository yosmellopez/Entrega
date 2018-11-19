import {Pipe, PipeTransform} from '@angular/core';
import {TipoDeSuperficie} from "../modelo";

@Pipe({
    name: 'tipoDeSuperficie'
})
export class TipoDeSuperficiePipe implements PipeTransform {

    transform(value: TipoDeSuperficie, args?: any): any {
        if (value)
            return value.nombre;
        return "";
    }
}
