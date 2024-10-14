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
        )
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
            () => {    
              this.clean     
            }
          )
          break
        case 'auth/invalid-email':
          this.alert.showAlert(
            'Error',                         
            'La dirección de correo electrónico no es válida.', 
            () => {    
              this.clean     
            }
          )
          break
        case 'auth/weak-password':
          this.alert.showAlert(
            'Error',                         
            'La contraseña es muy débil.', 
            () => {    
              this.clean     
            }
          )
          break
        default:
          this.alert.showAlert(
            'Error',                         
            'Ocurrió un error al registrar el usuario: ' + error.message, 
            () => {    
              this.clean     
            }
          )
          break
      }
    }
  }

  clean() {
    this.email = ''
    this.password = ''
  }

  onBackToLogin() {
    this.navController.navigateBack('/login'); // Navega hacia la página de inicio de sesión
  }
  
}

