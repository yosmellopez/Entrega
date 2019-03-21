import {Pipe, PipeTransform} from '@angular/core';
import {Persona} from "../modelo";

@Pipe({
    name: 'persona'
})
export class PersonaPipe implements PipeTransform {

    transform(value: Persona, args?: any): any {
        if (value){
            if (value.primerApellido!='-' && value.segundoApellido!='-'){
                return value.nombre+' '+value.primerApellido+' '+value.segundoApellido;
            } else {
                return value.nombre;
            }
        }
        return "";
    }
}
