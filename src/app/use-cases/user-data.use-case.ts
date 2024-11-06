// src/app/use-cases/user-data.use-case.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { StorageService } from 'src/managers/StorageService';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDataUseCase {
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private storageService: StorageService
  ) {}

  // Lógica para cargar y devolver el correo electrónico del usuario
  async loadUserEmail() {
    const user = await this.storageService.get('user');
    return user && user.email ? user.email : null;
  }
}