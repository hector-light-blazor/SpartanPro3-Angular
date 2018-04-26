import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtermine'
})
export class FilterminePipe implements PipeTransform {
  
  // Pipe helps search on dashboard for anything in the information...
  transform(array: any[], query: string): any {

    if(!array) return [];
    if(!query) return array;

    query = query.toUpperCase();
    return array.filter(customer => {
        var response = false;

        for(var x in customer) {
            if(customer[x]){
              response = customer[x].includes(query);
            }
            if(response) {
              break; // Exit Loop
            }
        }
        return response;
        
 
      
    });
  }

}
