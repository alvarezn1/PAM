import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { SessionManager } from 'src/managers/SessionManager';
import { StorageService } from 'src/managers/StorageService';

@Injectable({
  providedIn: 'root',
})
export class NavigationSessionCase {
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private sessionManager: SessionManager,
    private storageService: StorageService,
    private router: Router
  ) {}

  // Función para iniciar sesión
  async login(email: string, password: string) {
    try {
      const userCredential = await this.sessionManager.loginWith(email, password);
      const user = userCredential.user;

      // Verificamos si el usuario ya tiene un monto inicial en la base de datos
      const montoRef = this.db.database.ref(`usuarios/${user.uid}/montoInicial`);
      const snapshot = await montoRef.once('value');
      
      let montoInicial: string | null = snapshot.val();
      if (!montoInicial) {
        // Si no existe el monto inicial, lo solicitamos al usuario
        montoInicial = prompt('Por favor, ingresa tu monto inicial:');
        
        if (montoInicial) {
          // Guardamos el monto inicial en la Realtime Database
          await montoRef.set(montoInicial);
        }
      }
      
      // Guardamos la información del usuario en el almacenamiento local
      const userData = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
        montoInicial: montoInicial // Guardamos el monto inicial también en el storage
      };
      
      await this.storageService.set('user', userData);

      // Redirigimos al usuario a la página de inicio
      this.router.navigate(['/splash']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  // Lógica para redirigir a la vista de gastos
  goToGastos() {
    this.router.navigate(['/vista-gastos']);
  }

  // Lógica para cerrar la sesión del usuario
  async signOut() {
    await this.storageService.clear();
    this.router.navigate(['/splash']);
  }
}
