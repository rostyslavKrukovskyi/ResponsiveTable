import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveTableComponent } from './components/responsive-table/responsive-table.component';
import {ResponsiveTableRoutingModule} from "./responsive-table-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ResponsiveTableComponent,
  ],
  imports: [
    CommonModule,
    ResponsiveTableRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class ResponsiveTableModule { }
