import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AlertController } from '@ionic/angular';
import { ExchangeRateService } from '../../managers/exchange-rate.service';
import { StorageService } from 'src/managers/StorageService';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { first } from 'rxjs/operators';
import { InitialAmountCase } from '../use-cases/initial-amount.use-case';
import { NavigationSessionCase } from '../use-cases/navigation-session.use-case';
import { ExpenseManagementCase } from '../use-cases/expense-management.use-case';
import { ExternalDataCase } from '../use-cases/external-data.use-case';
import { ErrorAlertCase } from '../use-cases/error-alert.use-case';
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
  montoGastado: number = 0;
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private exchangeRateService: ExchangeRateService,
    private router: Router,
    private navigationSessionCase: NavigationSessionCase,
    private initialAmountCase: InitialAmountCase,
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService,
    private alertController: AlertController,
    private expenseManagementCase: ExpenseManagementCase,
    private externalDataCase: ExternalDataCase,
    private errorAlertCase: ErrorAlertCase,

  ) {}

  ngOnInit() {
    this.montoGastado = this.getMontoGastadoFromLocalStorage(); // Recupera el monto desde localStorage
    this.loadExchangeRates();
    this.loadData();
    this.loadInitialAmount();
  }

  loadExchangeRates() {
    this.externalDataCase.getExchangeRates('USD').subscribe(
      data => {
        this.rates = data;
        console.log(this.rates);
      },
      error => {
        console.error('Error fetching exchange rates', error);
        this.errorAlertCase.showErrorAlert('Error al obtener las tasas de cambio.');
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
    await this.expenseManagementCase.showAddDialog();
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
    await this.initialAmountCase.resetInitialAmount();
  }
  // Navegar a la vista de gastos
  goToGastos() {
    this.navigationSessionCase.goToGastos();
  }
  goToIngresos(){
    this.navigationSessionCase.goToIngresos();
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
  //resta el gasto al monto inicial
  getMontoGastadoFromLocalStorage(): number {
    const monto = localStorage.getItem('montoGastado');
    return monto ? parseFloat(monto) : 0; // Si no existe, retorna 0
  }
  
  }