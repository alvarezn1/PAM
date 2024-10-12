import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManager } from 'src/managers/SessionManager';
import { StorageService } from 'src/managers/StorageService';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router, 
    private sessionManager: SessionManager,
    private storageService: StorageService
  ) { }

    email: string = '';
    user: string = '';
    password: string = '';

  ngOnInit() { }

  async onLoginButtonPressed() {

    try {

      const userCredential = await this.sessionManager.loginWith(this.email, this.password)
      const user = userCredential.user

      const userData = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }

      await this.storageService.set('user', userData)
      this.router.navigate(['/splash'])

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }

}