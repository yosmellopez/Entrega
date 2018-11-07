import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'provincia'
})
export class ProvinciaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
