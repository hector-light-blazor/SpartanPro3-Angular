import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {

  bookmarks: Array<BookMark> = [];
  @Input() extent: any;
  @Output() close = new EventEmitter();
  @Output() action = new EventEmitter();
  constructor(private app:AppService) { }

  ngOnInit() {

 

    // if no user id kill the function lol :->
    if(!this.app.account_info.user_id) {
      return;
    }

    this.getBookmarks();

   
  }


  appearButton(mark) {
      mark.bappear = (mark.bappear) ? false : true;
  }

  addRow() {
    this.bookmarks.push({binput: true});
  }

  getBookmarks() {
    this.bookmarks = [];
      this.app.GET_METHOD(this.app.route.api.gBookmark + this.app.account_info.user_id).subscribe((response: any) => {
        
        if(!response.success) {
          return;
        }
        
        var data = response.data;
        var len  = data.length;  
        for(var x = 0; x < len; x++) {
          data[x].bappear = false;
          data[x].binput = false;
          if(typeof(data[x].bookmark_json) == "string") {
              data[x].bookmark_json = JSON.parse(data[x].bookmark_json);
          }
        }
      
        this.bookmarks = data;


    })
  }

  onZoom(mark:BookMark) {
  

   if(!mark.bookmark_json){
     return;
   }
    this.action.emit({extent: mark.bookmark_json});
  }

  onDelete(id) {
   

    this.app.POST_METHOD(this.app.route.api.dBookmark, {data: {id: id}}).subscribe((response:any) => {
        this.getBookmarks();
    })

  }

  onClose() {
   
    this.close.emit(true);
  }

  onSave(mark) {
    
    if(!this.app.account_info.user_id){
      return;
    }
    if(!this.extent) {
      this.bookmarks.pop();
      return;
    }
    mark.binput = false;
    
    this.app.POST_METHOD( this.app.route.api.sBookmark , {data: {id: this.app.account_info.user_id,extent: JSON.stringify(this.extent), name: mark.bookmark_name, comment: mark.bookmark_comments}}).subscribe((response:any) => {
       // console.log(response);
       this.bookmarks[this.bookmarks.length - 1].bookmark_json = this.extent;
    });
  }

}

interface BookMark {
  bookmark_name?: string;
  bookmark_comments?: string;
  bookmarks_id?: number;
  user_id?: number;
  bappear?: boolean;
  binput?: boolean;
  bookmark_json?: string;
}