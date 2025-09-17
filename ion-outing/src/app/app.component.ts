import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule , HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy, OnInit {
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
  isAdmin = false;
  constructor(private http: HttpClient, private router: Router) {
    this.getPlayers();
    const name = localStorage.getItem('uerName');
    if(name){
      this.name = name;
       this.isCreated = true;
    }
        this.refreshSub = interval(3000).subscribe(() => this.refresh());

  }
  ngOnInit(): void {
      this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      if (event.url.includes('admin')) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
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

  shuffle(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.get(host + '/api/shuffle').subscribe((data: any)=>{
      this.status = data.status;
      this.players = data.players;
    })
  }

    restShuffle(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.get(host + '/api/restShuffle').subscribe((data: any)=>{
      this.status = data.status;
      this.players = data.players;
    })
  }

  addNew(): void {
    this.name = '';
    this.isCreated = false;
    localStorage.removeItem('uerName');
  }

  lock(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.get(host + '/api/lock').subscribe((data: any)=>{
      this.status = data.status;
      this.players = data.players;
    })
  }
}
