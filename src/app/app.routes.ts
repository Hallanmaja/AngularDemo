import { Routes } from '@angular/router';
import { AjanvarausComponent } from './components/ajanvaraus/ajanvaraus';  // Poistettu .component

export const routes: Routes = [
  { path: '', redirectTo: '/ajanvaraus', pathMatch: 'full' },
  { path: 'ajanvaraus', component: AjanvarausComponent }
];