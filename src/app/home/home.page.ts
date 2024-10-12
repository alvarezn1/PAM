import { Component } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  email: string = '';  

  constructor(
    private router: Router, 
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService) {}

  async ngOnInit() { 
    this.loadData()
  }

  async loadData() {
    const userEmail = await this.storageService.get('userEmail')
    this.email = userEmail
  }

  async onSignOutButtonPressed() {
    this.cancelAlertService.showAlert(
      'Cerrar sesión',                         
      '¿Estás seguro de que quieres cerrar sesión?',  
      async () => {
        await this.storageService.clear();     
        this.router.navigate(['/splash']);     
      },
      () => {
        console.log('Sesión no cerrada');
      }
    )
  }

}