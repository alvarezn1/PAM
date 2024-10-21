import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AlertController } from '@ionic/angular';
import { ExchangeRateService } from '../../managers/exchange-rate.service';
import { StorageService } from 'src/managers/StorageService';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  rates: any;
  email: string = '';
  visibleRates: number = 5;
  initialAmount: number = 0;
  user: any;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private exchangeRateService: ExchangeRateService,
    private router: Router,
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadExchangeRates();
    this.loadData();
    this.loadInitialAmount();
  }

  loadExchangeRates() {
    this.exchangeRateService.getExchangeRates('USD').subscribe(
      data => {
        this.rates = data;
        console.log(this.rates);
      },
      error => {
        console.error('Error fetching exchange rates', error);
        this.showErrorAlert('Error al obtener las tasas de cambio.'); // Muestra un alert
      }
    );
  }

  async loadData() {
    try {
      this.user = await this.storageService.get('user');
      if (this.user && this.user.email) {
        this.email = this.user.email;
        console.log(`Correo electrónico cargado: ${this.email}`);
      } else {
        console.log('No se encontraron datos del usuario o no contiene un correo electrónico.');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  async loadInitialAmount() {
    try {
      const user = await this.afAuth.user.pipe(first()).toPromise();
      if (user) {
        // Recupera el monto inicial del usuario desde Firebase
        this.db.database.ref(`usuarios/${user.uid}/montoInicial`).once('value').then(snapshot => {
          this.initialAmount = snapshot.val() || 0;
          localStorage.setItem('initialAmount', this.initialAmount.toString());
        });
      } else {
        // Si no hay un usuario autenticado, solicita al usuario que ingrese uno
        await this.showInitialAmountPrompt();
      }
    } catch (error) {
      console.error('Error al cargar el monto inicial:', error);
    }
  }

  private async showInitialAmountPrompt() {
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
              await this.showErrorAlert('Por favor, ingresa un monto válido.');
            }
          },
        },
      ],
    });

    await alert.present();
  }

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

  async onSignOutButtonPressed() {
    this.cancelAlertService.showAlert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      async () => {
        await this.storageService.clear();
        this.router.navigate(['/splash']);
        console.log('Sesión cerrada y almacenamiento limpiado.');
      },
      () => console.log('Sesión no cerrada')
    );
  }

  showMore() {
    this.visibleRates += 5; 
  }

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
                await this.showErrorAlert('No hay usuario autenticado para actualizar el monto inicial en Firebase.');
              }
            } else {
              await this.showErrorAlert('Por favor, ingresa un monto válido.');
            }
          },
        },
      ],
    });
  
    await alert.present();
  }

  getFormattedInitialAmount(): string {
    return this.initialAmount.toLocaleString('es-CL', { minimumFractionDigits: 0 });
  }

  private async showErrorAlert(message: string) {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await errorAlert.present();
  }
}
