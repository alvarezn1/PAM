import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from "src/app/models/user.models";

@Injectable({
  providedIn: 'root',
})
export class SessionManager {

    constructor(
      private afAuth: AngularFireAuth,
      private router: Router,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController

      



    ) {}

    async register(user: User) {
      if (this.formValidation(user)) {
        let loader = await this.loadingCtrl.create({ message: "Espere por favor" });
        await loader.present();

        try {
          await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(data => {
            console.log(data);
            this.router.navigate(['login']);
          });

        } catch (error: any) {
          let errormessage = error.message || "Error al registrarse";
          this.showToast(errormessage);
        }
        await loader.dismiss();
      }
    }

    async performLogin(user: User) {
        if (this.formValidation(user)) {
          let loader = await this.loadingCtrl.create({ message: "Espere por favor" });
          await loader.present();
    
          try {
            await this.afAuth.signInWithEmailAndPassword(user.email, user.password);
            await this.router.navigate(['home']);
          } catch (error: any) {
            let errormessage = error.message || "Usuario no registrado";
            this.showToast(errormessage);
          }
    
          await loader.dismiss();
        }
      }

      logout(){
        this.afAuth.signOut().then(()=>{
          this.router.navigate(['login']);
          this.showToast('Sesion cerrada con exito');
        }).catch((error: any)=>{
          let errormessage = error.message ||"Error al cerrar sesion";
          this.showToast(errormessage)
        })


      }

    formValidation(user: User): boolean {
      if (!user.email) {
        this.showToast("Ingrese un email");
        return false;
      }
      if (!user.password) {
        this.showToast("Ingrese una contraseña");
        return false;
      }
      return true;
    }

    

    private showToast(message: string) {
      this.toastCtrl.create({
        message: message,
        duration: 4000
      }).then(toastData => toastData.present());
    }

    
}
