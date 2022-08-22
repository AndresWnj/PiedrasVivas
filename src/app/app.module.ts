import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Importamos el modulo de las rutas
import { RouteModule } from './route/route.module';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { StreamingComponent } from './streaming/streaming.component';

@NgModule({
  declarations: [
    AppComponent,
    StreamingComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RouteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
