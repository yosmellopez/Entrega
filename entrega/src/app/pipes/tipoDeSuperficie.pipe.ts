import {Pipe, PipeTransform} from '@angular/core';
import {TipoSuperficie} from "../modelo";

@Pipe({
    name: 'tipoDeSuperficie'
})
export class TipoSuperficiePipe implements PipeTransform {

    transform(value: TipoSuperficie, args?: any): any {
        if (value)
            return value.nombre;
        return "";
    }
}
