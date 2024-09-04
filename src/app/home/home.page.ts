import { Component } from '@angular/core';
import { SessionManager } from 'src/managers/SessionManager';
import { User } from "../models/user.models";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user = {} as User;
  

  constructor(private sessionManager: SessionManager) {}

  async logout(){
    await this.sessionManager.logout();
    
  }

 

}
