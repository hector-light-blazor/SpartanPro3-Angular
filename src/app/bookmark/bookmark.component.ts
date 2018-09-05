import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {

  bookmarks: Array<BookMark> = [];
 
  constructor(private app:AppService) { }

  ngOnInit() {

    this.app.GET_METHOD(this.app.route.api.gBookmark + this.app.account_info.user_id).subscribe((response: any) => {

        if(!response.success) {
          return;
        }
        
        var data = response.data;
        var len  = data.length;  
        for(var x = 0; x < len; x++) {
          data[x].bappear = false;
        }

        this.bookmarks = data;


    })
  }


  appearButton(mark) {
      mark.bappear = (mark.bappear) ? false : true;
  }

}

interface BookMark {
  bookmark_name: string;
  bookmark_comments: string;
  bookmarks_id?: number;
  user_id?: number;
  bappear: boolean;
}