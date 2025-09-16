import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule , HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ion-outing';
  data: any = '';
  count = 0;
  name = '';
  gender = '';
players : any[] = [];
  constructor(private http: HttpClient) {
    // const host = location.origin
    // this.http.get(host + '/hello').subscribe((data: any)=>{
    //   console.log('data', data);
    //   this.data = data.message;
    // })
    this.getPlayers();
  }

  savePlayer(): void{
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
//    fetch(host + '/api/addPlayer', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' }, // 👈 required
//   body: JSON.stringify({ name: this.name, gender: this.gender })
// });
        this.http.post(host + '/api/addPlayer', {name: this.name, gender: this.gender}).subscribe((data: any)=>{
      alert(data);
      this.getPlayers();
    })
  }

  getPlayers(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.get(host + '/api/players').subscribe((data: any)=>{
      this.players = data.players;
    })  
  }
  getCount(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.get(host + '/getData').subscribe((data: any)=>{
      this.count = data.data;
    })
  }
}
