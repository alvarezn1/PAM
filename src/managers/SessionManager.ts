import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class SessionManager {
  constructor(public fireAuth: AngularFireAuth) {
    this.setPersistence();
  }

  private async setPersistence() {
    try {
      // Configura la persistencia a LOCAL para que la sesión persista
      await this.fireAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      console.log('Persistencia de sesión configurada a LOCAL');
    } catch (error) {
      console.error('Error al configurar la persistencia de sesión:', error);
    }
  }

  async signOut() {
    return await this.fireAuth.signOut();
  }

  async registerUserWith(email: string, password: string): Promise<any> {
    return await this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  async loginWith(email: string, password: string): Promise<any> {
    return await this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  async resetPassword(email: string) {
    return await this.fireAuth.sendPasswordResetEmail(email);
  }

  async getProfile() {
    return await this.fireAuth.currentUser;
  }
}
