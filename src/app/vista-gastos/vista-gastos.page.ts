import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { SessionManager } from 'src/managers/SessionManager';
import { take } from 'rxjs/operators'; // Importa take para limitar la suscripción a una sola vez

@Component({
  selector: 'app-vista-gastos',
  templateUrl: './vista-gastos.page.html',
  styleUrls: ['./vista-gastos.page.scss'],
})
export class VistaGastosPage implements OnInit {
  gastos: any[] = [];
  userId: string | null = null;

  constructor(
    private db: AngularFireDatabase,
    private sessionManager: SessionManager,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      // Obtén el ID del usuario desde el SessionManager
      this.userId = await this.sessionManager.getCurrentUserId();

      if (this.userId) {
        this.getGastos();
      } else {
        console.error('No se pudo obtener el ID del usuario. Asegúrate de que el usuario esté autenticado.');
      }
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
    }
  }

  getGastos() {
    if (!this.userId) {
      console.error('No se pueden obtener los gastos, ID de usuario no disponible.');
      return;
    }

    // Recuperar gastos del usuario desde Firebase
    this.db
      .list(`usuarios/${this.userId}/gastos`)
      .snapshotChanges()
      .subscribe(
        (actions) => {
          this.gastos = actions
            .map((action) => {
              const data = action.payload.val();
              const id = action.key;
              return data ? { id, ...data } : null;
            })
            .filter((item) => item !== null);
        },
        (error) => {
          console.error('Error al recuperar los gastos:', error);
        }
      );
  }
  eliminarGasto(id: string) {
    if (!this.userId) {
      console.error('No se puede eliminar el gasto, ID de usuario no disponible.');
      return;
    }
  
    const gastoEliminar = this.gastos.find((gasto) => gasto.id === id);
  
    if (gastoEliminar) {
      const montoGasto = gastoEliminar.Monto_Gastado;
  
      // Eliminar gasto de Firebase
      this.db
        .list(`usuarios/${this.userId}/gastos`)
        .remove(id)
        .then(() => {
          console.log(`Gasto con ID ${id} eliminado.`);
          this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
          this.db
            .object(`usuarios/${this.userId}/gastos/${id}`)
            .update({
              latitud: null,
              longitud: null,
              Comentario_ubicacion: null, // Puedes eliminar o vaciar la descripción de la ubicación también
            })
            .catch((error) => console.error('Error al eliminar geolocalización:', error));
  
          // Actualizar el montoInicial del usuario de forma eficiente
          this.db
            .object(`usuarios/${this.userId}/montoInicial`)
            .valueChanges()
            .pipe(take(1)) // Limitar a una sola emisión de los datos
            .subscribe((montoInicial: any) => {
              if (typeof montoInicial === 'number') {
                const nuevoMontoInicial = montoInicial + montoGasto;
  
                // Actualizar el monto inicial en Firebase
                this.db
                  .object(`usuarios/${this.userId}`)
                  .update({ montoInicial: nuevoMontoInicial })
                  .catch((error) => console.error('Error al actualizar el monto inicial:', error));
              } else {
                console.warn('El montoInicial no es un número válido o no está definido:', montoInicial);
              }
            });
        })
        .catch((error) => {
          console.error('Error al eliminar el gasto:', error);
        });
    } else {
      console.error('No se encontró el gasto con el ID proporcionado.');
    }
  }
  

  editarGasto(id: string) {
    // Redirige al formulario de edición del gasto
    this.router.navigate(['/gastos.page.html', id]); // Cambia la ruta si es necesario
  }
}
