import { Pipe } from '@angular/core';

@Pipe({
  name: 'SortPipe'
})
export class SortPipe {
  transform(original: any[], compare: (a: any, b: any) => number): any[] {
    if (!compare) {
      return original;
    }
    const newArray = original.map((x, i) => 
      // Add a position property in to create a stable sort.
      Object.assign({}, x, {_position: i})
    );
    return newArray.sort((a, b) => {
      // Fake stability.
      const diff = compare(a, b);
      if (diff === 0) {
        return a._position - b._position;
      }
      return diff;
    });
  }
}
