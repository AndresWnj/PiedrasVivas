import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.css']
})
export class StreamingComponent implements OnInit {

  imagen="";
  constructor() { }

  ngOnInit(): void {
    this.imagen = "./app/../assets//images/i"+this.getRandomInt(1, 5)+"_landscape.png";
  }

  getRandomInt(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
