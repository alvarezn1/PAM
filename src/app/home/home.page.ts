import { Component } from '@angular/core';
import { SessionManager } from 'src/managers/SessionManager';
import { User } from "../models/user.models";
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user = {} as User;
  
  
  

  constructor(private sessionManager: SessionManager,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {}

  async logout(){
    await this.sessionManager.logout();
    
  }

  ngOnInit(){
    this.route.queryParams.subscribe(params =>{
      this.user.email = params ['email'];
      console.log('Hola,',this.user.email);
      this.cdr.detectChanges();
    })


  }

 

}
