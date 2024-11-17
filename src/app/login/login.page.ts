import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationSessionCase } from '../use-cases/navigation-session.use-case';  // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  loginError: boolean = false;
  constructor(
    private navigationSessionCase: NavigationSessionCase,  // Inyectamos el servicio
    private router: Router
  ) {}

  ngOnInit() {}

  async onLoginButtonPressed() {
    try {
      await this.navigationSessionCase.login(this.email, this.password);
      this.loginError = false; // Si el login es exitoso, ocultamos el mensaje de error
    } catch (error) {
      this.loginError = true; // Si hay error, mostramos el mensaje de error
      console.error('Error en el login:', error);
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}
