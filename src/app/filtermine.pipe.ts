import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtermine'
})
export class FilterminePipe implements PipeTransform {

  transform(array: any[], query: string): any {
    return array.filter(customer => {
      // console.log(args);
      if(query)
      {
        // console.log(args);
        if(customer.cfull_name)
        {
          return customer.cfull_name.includes(query.toUpperCase()) == true;
        }else{
            if(customer.cfirst_name) return customer.cfirst_name.includes(query.toUpperCase()) == true;

            if(customer.clast_name) return customer.clast_name.includes(query.toUpperCase()) == true;

        }
      }
        return customer;
      
    });
  }

}
