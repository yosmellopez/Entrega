import {Pipe, PipeTransform} from '@angular/core';
import {Municipio} from "../modelo";

@Pipe({
    name: 'municipio'
})
export class MunicipioPipe implements PipeTransform {

    transform(value: Municipio, args?: any): any {
        if (value)
            return value.nombre;
        return "";
    }
}
