import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { SessionManager } from 'src/managers/SessionManager';

@Component({
  selector: 'app-vista-gastos',
  templateUrl: './vista-gastos.page.html',
  styleUrls: ['./vista-gastos.page.scss'],
})
export class VistaGastosPage implements OnInit {
  gastos: any[] = [];
  userId: string | null = null; // Inicializa userId como null

  constructor(private db: AngularFireDatabase, private sessionManager: SessionManager) {}

  async ngOnInit() {
    this.userId = await this.sessionManager.getCurrentUserId(); // Obtén el ID del usuario autenticado
    console.log('User ID en VistaGastos:', this.userId); // Para depuración

    if (this.userId) {
      this.getGastos(); // Solo llama a getGastos si userId no es null
    } else {
      console.error('No se pudo obtener el ID del usuario, asegúrate de que el usuario esté autenticado.');
    }
  }
  getGastos() {
    if (!this.userId) {
      console.error('No se puede obtener los gastos, ID de usuario no disponible.');
      return;
    }
  
    this.db.list(`usuarios/${this.userId}/gastos`).snapshotChanges().subscribe(
      actions => {
        this.gastos = actions.map(action => {
          const data = action.payload.val(); // Obteniendo los datos del snapshot
          const id = action.key; // Obteniendo la clave del snapshot
  
          // Asegúrate de que data no sea nulo
          if (data) {
            return { id, ...data }; // Usa el operador de expansión
          } else {
            console.warn(`No se encontraron datos para el ID: ${id}`);
            return null; // Retorna null o maneja como necesites
          }
        }).filter(item => item !== null); // Filtra los elementos nulos
        console.log('Gastos recuperados:', this.gastos); // Para depuración
      },
      error => {
        console.error('Error al recuperar los gastos:', error); // Para manejar errores de la base de datos
      }
    );
  }
  
}
