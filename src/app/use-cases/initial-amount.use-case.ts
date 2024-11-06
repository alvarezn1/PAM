import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorAlertCase } from '../use-cases/error-alert.use-case';

@Injectable({
  providedIn: 'root',
})
export class InitialAmountCase {
  public initialAmount: number = 0;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private alertController: AlertController,
    private router: Router,
    private errorAlertCase: ErrorAlertCase
  ) {}

  // Mover showInitialAmountPrompt a este servicio
  async showInitialAmountPrompt() {
    const alert = await this.alertController.create({
      header: 'Configura tu Monto Inicial',
      inputs: [
        {
          name: 'newAmount',
          type: 'number',
          placeholder: 'Ingresa el monto inicial',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            const newAmount = parseFloat(data.newAmount);
            if (!isNaN(newAmount)) {
              this.initialAmount = newAmount;
              localStorage.setItem('initialAmount', newAmount.toString());
            } else {
              await this.errorAlertCase.showErrorAlert('Por favor, ingresa un monto válido.');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Formatea el monto inicial
  getFormattedInitialAmount(): string {
    return this.initialAmount.toLocaleString('es-CL', { minimumFractionDigits: 0 });
  }

  // Función para resetear el monto inicial
  async resetInitialAmount() {
    const alert = await this.alertController.create({
      header: 'Reiniciar Monto',
      inputs: [
        {
          name: 'newAmount',
          type: 'number',
          placeholder: 'Ingresa nuevo monto',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Reiniciar',
          handler: async (data) => {
            const newAmount = parseFloat(data.newAmount);
            if (!isNaN(newAmount)) {
              this.initialAmount = newAmount;
              localStorage.setItem('initialAmount', newAmount.toString());

              // Actualiza el monto inicial en Firebase
              const user = await this.afAuth.user.pipe(first()).toPromise();
              if (user) {
                await this.db.database.ref(`usuarios/${user.uid}/montoInicial`).set(newAmount);
                console.log(`Monto inicial actualizado en Firebase: ${newAmount}`);
              } else {
                await this.errorAlertCase.showErrorAlert('No hay usuario autenticado para actualizar el monto inicial en Firebase.');
              }
            } else {
              await this.errorAlertCase.showErrorAlert('Por favor, ingresa un monto válido.');
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
}
