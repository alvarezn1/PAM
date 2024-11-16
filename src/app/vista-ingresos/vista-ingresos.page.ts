import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router'; // Importa Router para la navegación
import { SessionManager } from 'src/managers/SessionManager';

@Component({
  selector: 'app-vista-ingresos',
  templateUrl: './vista-ingresos.page.html',
  styleUrls: ['./vista-ingresos.page.scss'],
})
export class VistaIngresosPage implements OnInit {
  ingresos: any[] = [];
  userId: string | null = null;

  constructor(private db: AngularFireDatabase, private sessionManager: SessionManager, private router: Router) {}

  async ngOnInit() {
    try {
      this.userId = await this.sessionManager.getCurrentUserId();
      console.log('User ID en VistaIngresos:', this.userId);

      if (this.userId) {
        this.getIngresos();
      } else {
        console.error('No se pudo obtener el ID del usuario, asegúrate de que el usuario esté autenticado.');
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

    this.db.list(`usuarios/${this.userId}/ingresos`).snapshotChanges().subscribe(
      actions => {
        this.ingresos = actions.map(action => {
          const data = action.payload.val();
          const id = action.key;

          if (data) {
            return { id, ...data };
          } else {
            console.warn(`No se encontraron datos para el ID: ${id}`);
            return null;
          }
        }).filter(item => item !== null);
        console.log('Ingresos recuperados:', this.ingresos);
      },
      error => {
        console.error('Error al recuperar los ingresos:', error);
      }
    );
  }

  eliminarIngreso(id: string) {
    const ingresoEliminar = this.ingresos.find(ingreso => ingreso.id === id);

    if (ingresoEliminar) {
      const montoIngreso = ingresoEliminar.Monto_Ingresado;

      // Elimina el ingreso de Firebase
      this.db.list(`usuarios/${this.userId}/ingresos`).remove(id).then(() => {
        console.log(`Ingreso con ID ${id} eliminado.`);

        // Elimina el ingreso de la lista en la vista
        this.ingresos = this.ingresos.filter(ingreso => ingreso.id !== id);
      }).catch(error => {
        console.error('Error al eliminar el ingreso:', error);
      });
    } else {
      console.error('No se encontró el ingreso con el ID proporcionado');
    }
  }

  editarIngreso(id: string) {
    // Redirige a una página de edición de ingresos con el ID del ingreso
    this.router.navigate(['/ingresos.page.html', id]);
  }
}
