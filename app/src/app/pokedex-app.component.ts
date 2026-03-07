import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pokedex',
  templateUrl: './pokedex-app.component.html',
  styleUrls: ['./pokedex-app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class PokedexAppComponent {}
