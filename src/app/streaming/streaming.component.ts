import { Component, OnInit } from '@angular/core';

import { environment } from "../../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.css']
})
export class StreamingComponent implements OnInit {

  imagen="";

  title = 'af-notification';
  message:any = null;
  constructor() {}
  ngOnInit(): void {
    this.imagen = "./app/../assets/images/i"+this.getRandomInt(1, 5)+"_landscape.png";
    // this.requestPermission();
    // this.listen();
  }
  // requestPermission() {
  //   const messaging = getMessaging();
  //   console.log("GET TOKEN....");
  //   getToken(messaging, 
  //    { vapidKey: environment.firebase.vapidKey}).then(
  //      (currentToken) => {

  //       console.log("CUAL TOKEN -> "+currentToken);
  //        if (currentToken) {
  //          console.log("Hurraaa!!! we got the token.....");
  //          console.log(currentToken);
  //        } else {
  //          console.log('No registration token available. Request permission to generate one.');
  //        }
  //    }).catch((err) => {
  //       console.log('error get token ', err);
  //   });
  // }
  // listen() {
  //   const messaging = getMessaging();
  //   onMessage(messaging, (payload) => {
  //     console.log('Message received. ', payload);
  //     this.message=payload;
  //   });
  // }



  getRandomInt(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
