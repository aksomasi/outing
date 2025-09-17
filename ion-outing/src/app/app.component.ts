import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter, interval, Subscription } from 'rxjs';
import { MultiLayerSpinnerComponent } from './components/spinner/multi-layer-spinner.component';
import { VerticalCarouselComponent } from './components/carousel/vertical-carousel.component';
import { WaitingBannerComponent } from './components/waiting/waiting-banner.component';
import { BuzzerComponent } from './components/buzzer/carousel/buzzer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule ,BuzzerComponent, WaitingBannerComponent,  VerticalCarouselComponent, HttpClientModule, MultiLayerSpinnerComponent],
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
teamsCount = 4;
  private refreshSub!: Subscription;
  isCreated = false
  isAdmin = false;
  isBuzzer = false;
  pics: any[] = [];
  outer = ['Anil','Bhavna','Chitra','Deepak','Esha','Farhan','Gita','Harish','Indu','Jai','Kiran','Lata','Mahesh','Nisha','Omkar'];
middle = ['Pooja','Qadir','Rhea','Sanjay','Tanvi','Uday','Vaishali','Wasim','Xenia','Yash','Zara','Aarav','Bindi','Charan','Divya'];
inner = ['Eshan','Falguni','Gopal','Hemant','Ipsita','Jatin','Kavya','Laksh','Maya','Neeraj','Ovi','Pranav','Ragini','Suresh','Tara'];
  constructor(private http: HttpClient, private router: Router) {
    this.getPlayers();
    this.getPics();
    const name = localStorage.getItem('uerName');
    if(name){
      this.name = name;
       this.isCreated = true;
    }
        this.refreshSub = interval(3000).subscribe(() => this.refresh());

  }

  private getPics(): void {
            const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
      this.http.get(host + '/api/pics').subscribe((data: any)=>{
      this.pics = data.files;
    })
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
        this.http.post(host + '/api/addPlayer', {name: this.name, gender: this.gender}).subscribe((data: any)=>{
     localStorage.setItem('uerName', this.name);
     this.isCreated = true;
     this.getPlayers();
    })
  }

  deletePlayer(name: string): void{
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
        this.http.delete(host + '/api/player/' + name).subscribe((data: any)=>{
     this.getPlayers();
    })
  }

  stop(): void{
       const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
        this.http.get(host + '/api/stop').subscribe((data: any)=>{
     this.getPlayers();
    })
  }
   reset(): void{
       const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
        this.http.get(host + '/api/reset').subscribe((data: any)=>{
     this.getPlayers();
    })
  }
  getPlayers(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.get(host + '/api/players').subscribe((data: any)=>{
      this.players = data.players;
    })  
  }
  currentTeam: any;
  otherTeams: any[] = [];
  refresh(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.get(host + '/api/refresh').subscribe((data: any)=>{
      this.status = data.status;
      this.players = data.players;
      if(data.resetFlag){
        localStorage.removeItem('uerName');
      }
      if(this.status === 'Shuffle Completed' && data.shuffledTeams.length > 0){ 
              this.teams = data.shuffledTeams;
             const { currentTeam, otherTeams} = this.splitByName(this.name, this.teams);
              this.currentTeam = currentTeam;
              this.otherTeams = otherTeams;
      }
    });
  }

  shuffle(): void {
        const host = location.origin === 'http://localhost:4200' ? 'http://localhost:3000' : location.origin
    this.http.post(host + '/api/shuffle', {teamsCount: this.teamsCount}).subscribe((data: any)=>{
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

  
 splitByName(name: string, teams: any[]) {
  const idx = teams.findIndex(t => t.members.some((m:any) => m.name === name));
  if (idx === -1) {
    return { currentTeam: null, otherTeams: teams };
  }
  return {
    currentTeam: teams[idx],
    otherTeams: teams.filter((_, i) => i !== idx),
  };
}
}
