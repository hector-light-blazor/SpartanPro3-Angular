import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-user-u',
  templateUrl: './user-u.component.html',
  styleUrls: ['./user-u.component.css']
})
export class UserUComponent implements OnInit {

  @ViewChild('displayWarning') wrnArchive: ElementRef;
  @ViewChild('displayBadge')  badge: ElementRef; //this is to change badge avatar and edit image..
  @ViewChild('wndUsers') window: ElementRef; //This element is the window of users..
 // @ViewChild(CanvasEditingComponent) canvasEditing: CanvasEditingComponent;
  editOnOff:boolean = false;

  users = [];
  selected_user: any = "";
  isAlive: boolean= true;


  constructor(private _appService: AppService) { }

  ngOnInit() {

  }
//   ngOnInit() {
//     //On Init lets fetch users data for update....
//     this._fetchUsers();
//     //Next lets get the canvas give it to the avatar service so he can control the animation..
//     //this._avatarService._setCanvasElements(this.cropCanvas, this.previewCanvas);

//     //set the file input avatar to service..
//     //this._avatarService._setAvatarElementFileInput(this.avatar);

//     //this is to get click from crop and view avatar from toolbar settings..
//     this._appService._settings.click.takeWhile(() => this.isAlive).subscribe(response =>{
        
//         if(response == Config.TOOLBAR_CLICK.SETTINGS.USER.CROP){
//             this.canvasEditing._cropPic();
//             //this._avatarService._cropPic();
//             return;
//         }else if(response == Config.TOOLBAR_CLICK.SETTINGS.USER.VIEW){
//           this._hideBadge();
//           this._displayWindowUsers();
//           this.selected_user.icon = this.canvasEditing._getImage();

//           //Here we are going to upload this icon for this user...

//           let attributes = {};
//           let arr = this.selected_user.icon.split(";");
//           let arr2 = arr[1].split(",");
//           attributes['id']   = this.selected_user.user_id;
//           attributes['icon'] = '{"type" : "'  + arr[0]  +'", "encode" : "'  + arr2[0]  + '", "data" : "' +  arr2[1] +  '"}';
         
//           //Upload this information to the server...
//           this._appService.POST_METHOD(Config.SITES.UPLOAD_PROFILE_PIC, attributes).subscribe(response => {
//               //console.log(response);
//           });
//       }    
//     });

//   }


//   ngOnDestroy() {
//     //Called once, before the instance is destroyed.
//     //Add 'implements OnDestroy' to the class.
//     this._appService._toolbarBtns.SETTINGS_PHOTO = false;

//     //destroy the click take whilte..
//     this.isAlive = false;
//   }

//   //Module to fetch users...
//   _fetchUsers(){
//     this._appService.GET_METHOD(Config.SITES.FETCH_USERS).subscribe(response => {
//       console.log(response);
//       let lng = response.data.length;
      
//       for(let i = 0; i < lng; i++){
//           if(response.data[i].icon){
//              let icon = JSON.parse(response.data[i].icon);

//              response.data[i].icon = icon.type + ";" + icon.encode + "," + icon.data;
//           }
//           if(response.data[i].config_id) response.data[i].config_id = JSON.parse(response.data[i].config_id);
//       }
//       this.users = response.data
//     });
//   }

//   //Display component to edit avatar...
//   _displayBadge(user){
//     this.selected_user = user;


//     this.badge.nativeElement.style.display = "block";
//     //this._avatarService._setImage(user.icon);

//     //Turn on the toolbar to edit avatar image..
//     //display toolbar on..
//     this._appService.tooglePhotoSettings();
//   }

//  //Close the badge editing..
//   _hideBadge(){
//     this.badge.nativeElement.style.display = "none";
//   }

//   //Close the window of users...
//   _hideWindowUsers(){
//     this.window.nativeElement.style.display = "none";
//   }

//   //Display the windows of users...
//   _displayWindowUsers(){
//     this.window.nativeElement.style.display = "block";

//   }

//   //=-=-=-==-=-=- DISPLAY EDIT USER FORM =-=-=-=-=-=-=-=-=
//   _displayEdit(user){
   
//     this.selected_user = user;
//     this.editOnOff = true;
//     this._hideWindowUsers();

//   }

//   _closeEdit(){
//     this.editOnOff = false;
//     this._displayWindowUsers();
//     this._fetchUsers();
//   }


//   //Display warning for archive..
//   //Display pop up are you sure to archive user...
//   _displayWarning(user){  
//     //Save selected user in variable..
//     this.selected_user = user;
//     this.wrnArchive.nativeElement.style.display = "block";
//     window.scrollTo(500, 0);  //lets scroll up to the message...
//   }

//   //Close the warning for warning..
//   _closeWarning(){
//     this.wrnArchive.nativeElement.style.display = "none";
//   }

//   //Send Archive for user...
//   sendArchive(){
//       this._appService.POST_METHOD(Config.SITES.USER_ARCHIVE, this.selected_user.user_id).subscribe(response => {
//           if(response.success){
//             this._closeWarning();
//           }else{
//             this._closeWarning();
//             jQuery.Notify({
//               caption: Config.APP,
//               content: "Archive failed",
//               type: Config.MSG.ERROR
//             });
//           }
//       });
//   }

}
