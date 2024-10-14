import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; 
import { ExchangeRateService } from '../../managers/exchange-rate.service';
import { StorageService } from 'src/managers/StorageService';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  rates: any;
  email: string = '';
  visibleRates: number = 5; 
  initialAmount: number = 0; 
  user: any; 

  constructor(
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
    const storedAmount = localStorage.getItem('initialAmount');
    if (storedAmount) {
      this.initialAmount = parseFloat(storedAmount);
    } else {
      // Si no hay un monto inicial guardado, solicita al usuario que ingrese uno
      await this.showInitialAmountPrompt();
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
            } else {
              await this.showErrorAlert('Por favor, ingresa un monto válido.');
            }
          },
        },
      ],
    });

    await alert.present();
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
