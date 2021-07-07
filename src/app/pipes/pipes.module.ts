import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrderrByPipe} from './OrderrByPipe';



@NgModule({
  declarations: [OrderrByPipe],
  imports: [
    CommonModule
  ],
  exports: [OrderrByPipe]
})
export class PipesModule { }
