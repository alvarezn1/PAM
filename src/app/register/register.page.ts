import { Component, OnInit } from '@angular/core';
import { SessionManager } from 'src/managers/SessionManager';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage {
  email: string = '';
  password: string = '';

  constructor(
    private sessionManager: SessionManager, 
    private router: Router,
    private alert: CancelAlertService,
    private navController: NavController
  ) { }

  async onRegisterButtonPressed() {
    // Validación de campos vacíos
    if (!this.email || !this.password) {
      this.alert.showAlert(
        'Error',
        'Por favor, completa todos los campos.',
        () => {}
      );
      return;
    }

    // Validación del formato del correo electrónico
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      this.alert.showAlert(
        'Error',
        'Por favor, introduce un correo electrónico válido.',
        () => {}
      );
      return;
    }

    // Validación de la contraseña (por ejemplo, al menos 6 caracteres)
    if (this.password.length < 6) {
      this.alert.showAlert(
        'Error',
        'La contraseña debe tener al menos 6 caracteres.',
        () => {}
      );
      return;
    }

    try {
      const userCredential = await this.sessionManager.registerUserWith(
        this.email,
        this.password
      );

      const user = userCredential.user;

      if (user) {
        this.alert.showAlert(
          'Registro exitoso',
          'Ya eres parte de nuestro sistema',
          () => {
            this.router.navigate(['/splash']);
          }
        );
      } else {
        alert('¡Registro exitoso!');
      }

      this.router.navigate(['/splash']);
      
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.alert.showAlert(
            'Error',
            'Este correo electrónico ya está en uso. Por favor, utiliza otro o inicia sesión.',
            () => { this.clean(); }
          );
          break;
        case 'auth/invalid-email':
          this.alert.showAlert(
            'Error',
            'La dirección de correo electrónico no es válida.',
            () => { this.clean(); }
          );
          break;
        case 'auth/weak-password':
          this.alert.showAlert(
            'Error',
            'La contraseña es muy débil.',
            () => { this.clean(); }
          );
          break;
        default:
          this.alert.showAlert(
            'Error',
            'Ocurrió un error al registrar el usuario: ' + error.message,
            () => { this.clean(); }
          );
          break;
      }
    }
  }

  clean() {
    this.email = '';
    this.password = '';
  }

  onBackToLogin() {
    this.navController.navigateBack('/login'); // Navega hacia la página de inicio de sesión
  }
}
