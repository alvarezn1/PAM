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
import { ChangeDetectorRef } from '@angular/core';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular'; // Asegúrate de importar IonRefresher
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
  userId: string = ''; // UID del usuario actual
  montoInicial: number = 0;

  private refreshInterval: any;

  constructor(
    private cdRef: ChangeDetectorRef,
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
    private errorAlertCase: ErrorAlertCase
  ) {}

  ngOnInit() {
    this.loadExchangeRates();
    this.loadData();
    this.loadInitialAmount();
    // Inicia el refresco automático cada 5 segundos
    this.refreshInterval = setInterval(() => {
      this.doRefresh(); // Llamamos al método doRefresh sin evento aquí
    }, 1000); // 1000ms = 5 segundos
  }
  ngOnDestroy() {
    // Detiene el intervalo cuando el componente se destruye
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  
  // Método para realizar el refresco cuando el usuario desliza hacia abajo
  doRefresh(event?: CustomEvent<RefresherEventDetail>) {
    console.log('Inicio de refresco...');
  
    // Recarga solo los datos necesarios, excluyendo la API de tasas de cambio
    // this.loadExchangeRates(); // Comentado para no refrescar la API
    this.loadData(); // Recargar datos del usuario
    this.loadInitialAmount(); // Recargar el monto inicial
  
    // Si el evento está presente, completamos el refresco
    if (event) {
      setTimeout(() => {
        const refresher = event.target as unknown; // Convertimos a 'unknown' primero
        if (refresher && (refresher as IonRefresher).complete) {
          (refresher as IonRefresher).complete(); // Ahora podemos llamar a complete() de manera segura
          console.log('Refresco completado.');
        } else {
          console.error('El target no es un IonRefresher.');
        }
      }, 1000); // Simulamos un pequeño retraso
    } else {
      console.log('Refresco automático completado.');
    }
  }
  


  // Carga las tasas de cambio
  loadExchangeRates() {
    this.externalDataCase.getExchangeRates('USD').subscribe(
      (data) => {
        this.rates = data;
        console.log(this.rates);
      },
      (error) => {
        console.error('Error fetching exchange rates', error);
        this.errorAlertCase.showErrorAlert('Error al obtener las tasas de cambio.');
      }
    );
  }

  // Carga datos del usuario
  async loadData() {
    try {
      this.user = await this.storageService.get('user');
      if (this.user?.email) {
        this.email = this.user.email;
        console.log(`Correo electrónico cargado: ${this.email}`);
      } else {
        console.log('No se encontraron datos del usuario o no contiene un correo electrónico.');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  // Escucha cambios en el monto inicial desde Firebase
  listenToInitialAmount() {
    this.db
    .object(`users/${this.userId}/monto_inicial`)
    .valueChanges()
    .subscribe((montoInicial: any) => {
      console.log('Monto inicial actualizado:', montoInicial);
      if (typeof montoInicial === 'number') {
        this.montoInicial = montoInicial;
      } else {
        console.warn('El montoInicial no es un número válido o no está definido:', montoInicial);
      }
    });
  }
  

  // Carga el monto inicial del usuario
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

  // Muestra el cuadro de diálogo para agregar un gasto
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

  goToGastos() {
    this.navigationSessionCase.goToGastos();
  }

  goToIngresos() {
    this.navigationSessionCase.goToIngresos();
  }

  getFormattedInitialAmount(): string {
    console.log('Monto actual en getFormattedInitialAmount:', this.initialAmount);  // Verifica el valor actual
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
