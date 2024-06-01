import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponsiveTableComponent } from './components/responsive-table/responsive-table.component';

const routes: Routes = [
  { path: '', component: ResponsiveTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsiveTableRoutingModule { }
