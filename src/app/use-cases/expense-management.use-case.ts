import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ExpenseManagementCase {
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private router: Router
  ) {}

  // Método para mostrar el diálogo de adición de gasto o ingreso
  async showAddDialog() {
    const alert = await this.alertController.create({
      header: 'Añadir',
      buttons: [
        {
          text: 'Gasto',
          handler: () => this.router.navigate(['/gastos']),
        },
        {
          text: 'Ingreso',
          handler: () => this.router.navigate(['/ingresos']),
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  // Método para agregar un gasto
  async addExpense(expenseData: any) {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid;

    if (!userId) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No estás autenticado. Por favor, inicia sesión.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    return this.db.list(`usuarios/${userId}/gastos`).push(expenseData);
  }
}
