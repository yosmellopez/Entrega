import {Pipe, PipeTransform} from '@angular/core';
import {Persona} from "../modelo";

@Pipe({
    name: 'persona'
})
export class PersonaPipe implements PipeTransform {

    transform(value: Persona, args?: any): any {
        if (value)
            return value.nombre;
        return "";
    }
}
