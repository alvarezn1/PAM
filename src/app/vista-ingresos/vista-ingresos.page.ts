import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { SessionManager } from 'src/managers/SessionManager';
import { take } from 'rxjs/operators'; // Importa take para limitar la suscripción a una sola vez

@Component({
  selector: 'app-vista-ingresos',
  templateUrl: './vista-ingresos.page.html',
  styleUrls: ['./vista-ingresos.page.scss'],
})
export class VistaIngresosPage implements OnInit {
  ingresos: any[] = [];
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
        this.getIngresos();
      } else {
        console.error('No se pudo obtener el ID del usuario. Asegúrate de que el usuario esté autenticado.');
      }
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
    }
  }

  getIngresos() {
    if (!this.userId) {
      console.error('No se pueden obtener los ingresos, ID de usuario no disponible.');
      return;
    }

    // Recuperar ingresos del usuario desde Firebase
    this.db
      .list(`usuarios/${this.userId}/ingresos`)
      .snapshotChanges()
      .subscribe(
        (actions) => {
          this.ingresos = actions
            .map((action) => {
              const data = action.payload.val();
              const id = action.key;
              return data ? { id, ...data } : null;
            })
            .filter((item) => item !== null);
        },
        (error) => {
          console.error('Error al recuperar los ingresos:', error);
        }
      );
  }

  eliminarIngreso(id: string) {
    if (!this.userId) {
      console.error('No se puede eliminar el ingreso, ID de usuario no disponible.');
      return;
    }

    const ingresoEliminar = this.ingresos.find((ingreso) => ingreso.id === id);

    if (ingresoEliminar) {
      const montoIngreso = ingresoEliminar.Monto_Ingresado;

      // Eliminar ingreso de Firebase
      this.db
        .list(`usuarios/${this.userId}/ingresos`)
        .remove(id)
        .then(() => {
          console.log(`Ingreso con ID ${id} eliminado.`);
          this.ingresos = this.ingresos.filter((ingreso) => ingreso.id !== id);

          // Actualizar el montoInicial del usuario de forma eficiente
          this.db
            .object(`usuarios/${this.userId}/montoInicial`)
            .valueChanges()
            .pipe(take(1)) // Limitar a una sola emisión de los datos
            .subscribe((montoInicial: any) => {
              if (typeof montoInicial === 'number') {
                const nuevoMontoInicial = montoInicial - montoIngreso;

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
          console.error('Error al eliminar el ingreso:', error);
        });
    } else {
      console.error('No se encontró el ingreso con el ID proporcionado.');
    }
  }

  editarIngreso(id: string) {
    // Redirige al formulario de edición del ingreso
    this.router.navigate(['/gastos.page.html', id]); // Cambia la ruta si es necesario
  }
}
