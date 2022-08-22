import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Importamos el modulo de las rutas
import { RouteModule } from './route/route.module';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { StreamingComponent } from './streaming/streaming.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    StreamingComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RouteModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
