import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(arrayOfObjects: any[], searchTerm: string): any {
    return arrayOfObjects.filter((object) => object.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }
}
