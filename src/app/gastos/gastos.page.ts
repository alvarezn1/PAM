import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importa Router
import { ExchangeRateService } from '../../managers/exchange-rate.service';
import { StorageService } from 'src/managers/StorageService';
import { CancelAlertService } from 'src/managers/CancelAlertService';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage implements OnInit {
  cantidad: number=0;
  categoria: string="";
  fecha: string="";
  comentario: string="";
  foto: File | null;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private alertController: AlertController,
    private router: Router, // Agrega Router aquí
    private exchangeRateService: ExchangeRateService,
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService
  ) {
    this.foto = null;
  }

  ngOnInit() {
    // Lógica al inicializar el componente
  }

  async addExpense() {
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

    const expenseData = {
      cantidad: this.cantidad,
      categoria: this.categoria,
      fecha: this.fecha,
      comentario: this.comentario,
    };

    this.db.list(`usuarios/${userId}/gastos`).push(expenseData)
      .then(() => {
        this.showAlert('Gasto añadido con éxito');
        this.resetForm();
        this.router.navigate(['/home']); // Redirige a la vista del home
      })
      .catch(error => {
        this.showAlert(`Error al añadir el gasto: ${error.message}`);
      });
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  resetForm() {
    this.cantidad = 0;
    this.categoria = '';
    this.fecha = '';
    this.comentario = '';
    this.foto = null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.foto = file;
  }
}
