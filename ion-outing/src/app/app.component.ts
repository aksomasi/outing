import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule , HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy{
  title = 'ion-outing';
  data: any = '';
  count = 0;
  name = '';
  gender = '';
  status = '';
players : any[] = [];
teams : any[] = [];
  private refreshSub!: Subscription;
  isCreated = false

  constructor(private http: HttpClient) {
    // const host = location.origin
    // this.http.get(host + '/hello').subscribe((data: any)=>{
    //   console.log('data', data);
    //   this.data = data.message;
    // })
    this.getPlayers();
    const name = localStorage.getItem('uerName');
    if(name){
      this.name = name;
       this.isCreated = true;
    }
        this.refreshSub = interval(3000).subscribe(() => this.refresh());

  }
  ngOnDestroy(): void {
 if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
    }

  savePlayer(): void{
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
//    fetch(host + '/api/addPlayer', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' }, // 👈 required
//   body: JSON.stringify({ name: this.name, gender: this.gender })
// });
        this.http.post(host + '/api/addPlayer', {name: this.name, gender: this.gender}).subscribe((data: any)=>{
     localStorage.setItem('uerName', this.name);
     this.isCreated = true;
     this.getPlayers();
    })
  }

  getPlayers(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.get(host + '/api/players').subscribe((data: any)=>{
      this.players = data.players;
    })  
  }
  refresh(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.get(host + '/api/refresh').subscribe((data: any)=>{
      this.status = data.status;
      this.players = data.players;
    })
  }
}
