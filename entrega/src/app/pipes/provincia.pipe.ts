import {Pipe, PipeTransform} from '@angular/core';
import {Provincia} from "../modelo";

@Pipe({
    name: 'provincia'
})
export class ProvinciaPipe implements PipeTransform {

    transform(value: Provincia, args?: any): any {
        if (value)
            return value.nombre;
        return "";
    }
}
