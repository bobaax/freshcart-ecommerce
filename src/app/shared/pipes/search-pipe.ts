import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(array: any[], searchTerm: string): any[] {
    if (!array || !searchTerm) {
      return array;
    }
    return array.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }

}
