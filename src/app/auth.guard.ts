import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, tap } from 'rxjs';


export const authGuard:  CanActivateFn=(route,state)=>{
  
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);
  return  afAuth.authState.pipe(
    map(user=> !!user),
    tap(loggedIn=>{
      if (!loggedIn){
        router.navigate(['login']);
      }
    })
  )
  

  
}