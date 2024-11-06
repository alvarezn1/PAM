import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database'; // Usa Realtime Database

@Injectable({
  providedIn: 'root'
})
export class GastoService {

  constructor(private db: AngularFireDatabase) {}

  eliminarGasto(userId: string, id: string): Promise<void> {
    return this.db.list(`usuarios/${userId}/gastos`).remove(id); // Usa .remove() en lugar de .delete()
  }
}
