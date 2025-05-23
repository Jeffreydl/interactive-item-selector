import { Routes } from '@angular/router';
import { ItemSelectorComponent } from '@/app/item-selector/item-selector.component';

export const routes: Routes = [
  { path: '', component: ItemSelectorComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
