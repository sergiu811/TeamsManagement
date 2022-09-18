import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testPractic';
  constructor(private router:Router){}
  goToTeams(){
    this.router.navigate(['teams'])
  }
  goToPlayers(){
    this.router.navigate(['players'])
  }
}
