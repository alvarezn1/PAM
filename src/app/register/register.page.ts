import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from "../models/user.models";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  async register() {
    if (this.isFormValid()) {
      try {
        const loading = await this.loadingCtrl.create({
          message: 'Registrando...',
        });
        await loading.present();

        await this.afAuth.createUserWithEmailAndPassword(this.user.email, this.user.password);
        await loading.dismiss();
        this.router.navigate(['/login']);
      } catch (error) {
        await this.loadingCtrl.dismiss();
        this.showToast('Error al registrar el usuario');
      }
    }
  }

  isFormValid(): boolean {
    if (!this.user.name.trim()) {
      this.showToast('El nombre es obligatorio');
      return false;
    }
    if (!this.user.email.trim() || !this.isEmailValid(this.user.email)) {
      this.showToast('El correo electrónico no es válido');
      return false;
    }
    if (!this.user.password || this.user.password.length < 6) {
      this.showToast('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  }

  isEmailValid(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}