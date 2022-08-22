import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

//Debemos importar los componentes a enrutar
import { StreamingComponent } from '../streaming/streaming.component';

const mRoutes: Routes = [
  {path:"streaming", component:StreamingComponent}
   //{path:"qr", component:HomeComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(mRoutes)
  ]
})
export class RouteModule { }
