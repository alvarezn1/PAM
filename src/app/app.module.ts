import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';

import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    IonicStorageModule.forRoot(),
    AngularFireModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"ionictestapp-6355f","appId":"1:917555013625:web:2f6ceeb25d578f020bbf28","storageBucket":"ionictestapp-6355f.appspot.com","apiKey":"AIzaSyAs23Te1KQpkadfclC7nKlUoebPqpTgbDg","authDomain":"ionictestapp-6355f.firebaseapp.com","messagingSenderId":"917555013625"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase())],
  bootstrap: [AppComponent],
})
export class AppModule {}