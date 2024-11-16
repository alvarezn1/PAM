import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorAlertCase {
  constructor(private alertController: AlertController) {}

  // Método para mostrar una alerta de error con un mensaje personalizado
  async showErrorAlert(message: string, title: string = 'Error') {
    const alert = document.createElement('ion-alert');
    alert.header = title; // Título dinámico
    alert.message = message;
    alert.buttons = ['OK'];
  
    document.body.appendChild(alert);
    await alert.present();
  }
  
    // Lógica para mostrar una alerta genérica con título y mensaje
    async showAlert(message: string) {
      const alert = await this.alertController.create({
        header: 'Información',
        message,
        buttons: ['OK'],
      });
      await alert.present();
    }
}