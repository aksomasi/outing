import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ion-outing';
  data: any = '';
  count = 0;
  constructor(private http: HttpClient) {
    this.http.get('http://localhost:3000/hello').subscribe((data: any)=>{
      console.log('data', data);
      this.data = data.message;
    })
  }

  getCount(): void {
    this.http.get('http://localhost:3000/getData').subscribe((data: any)=>{
      this.count = data.data;
    })
  }
}
