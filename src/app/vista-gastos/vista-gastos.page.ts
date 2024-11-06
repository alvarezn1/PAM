import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router'; // Importa Router para la navegación
import { SessionManager } from 'src/managers/SessionManager';

@Component({
  selector: 'app-vista-gastos',
  templateUrl: './vista-gastos.page.html',
  styleUrls: ['./vista-gastos.page.scss'],
})
export class VistaGastosPage implements OnInit {
  gastos: any[] = [];
  userId: string | null = null;

  constructor(private db: AngularFireDatabase, private sessionManager: SessionManager, private router: Router) {}

  async ngOnInit() {
    try {
      this.userId = await this.sessionManager.getCurrentUserId();
      console.log('User ID en VistaGastos:', this.userId);

      if (this.userId) {
        this.getGastos();
      } else {
        console.error('No se pudo obtener el ID del usuario, asegúrate de que el usuario esté autenticado.');
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

    this.db.list(`usuarios/${this.userId}/gastos`).snapshotChanges().subscribe(
      actions => {
        this.gastos = actions.map(action => {
          const data = action.payload.val();
          const id = action.key;

          if (data) {
            return { id, ...data };
          } else {
            console.warn(`No se encontraron datos para el ID: ${id}`);
            return null;
          }
        }).filter(item => item !== null);
        console.log('Gastos recuperados:', this.gastos);
      },
      error => {
        console.error('Error al recuperar los gastos:', error);
      }
    );
  }

  eliminarGasto(id: string) {
    this.db.list(`usuarios/${this.userId}/gastos`).remove(id).then(() => {
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
      console.log(`Gasto con ID ${id} eliminado.`);
    }).catch(error => {
      console.error('Error al eliminar el gasto:', error);
    });
  }

  editarGasto(id: string) {
    // Redirige a una página de edición de gastos con el ID del gasto
    this.router.navigate(['/gastos.page.html', id]);
  }
}
