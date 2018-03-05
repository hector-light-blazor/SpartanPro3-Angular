import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
@Pipe({
  name: 'datatable'
})
export class DatatablePipe implements PipeTransform {

  transform(array: any[], query: string): any {

    if (query) {
          return _.filter(array, row => {
              for(let key in row){
                
                if(row[key])
                {
                  if(row[key].indexOf(query.toUpperCase()) > -1){
                    
                    return row;
                    
                  }
                }
            }
          });
      }
      return array;
  }

}
