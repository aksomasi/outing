import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BuzzerComponent } from './components/buzzer/carousel/buzzer.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'admin', component: AppComponent },

];
