import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { SessionManager } from 'src/managers/SessionManager';
import { StorageService } from 'src/managers/StorageService';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private sessionManager: SessionManager,
    private storageService: StorageService
  ) {}

  ngOnInit() {}

  async onLoginButtonPressed() {
    try {
      const userCredential = await this.sessionManager.loginWith(this.email, this.password);
      const user = userCredential.user;

      // Aquí preguntas al usuario por el monto inicial
      const montoInicial = prompt('Por favor, ingresa tu monto inicial:');
      
      if (montoInicial) {
        // Guardas el monto inicial en la Realtime Database
        await this.db.database.ref(`usuarios/${user.uid}/montoInicial`).set(montoInicial);
      }

      // Guarda la información del usuario en el almacenamiento local
      const userData = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      
      await this.storageService.set('user', userData);
      
      // Rediriges al usuario a la página de inicio
      this.router.navigate(['/splash']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}
