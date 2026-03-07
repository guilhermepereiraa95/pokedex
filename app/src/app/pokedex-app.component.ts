import { Component, Inject, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'pokedex',
  templateUrl: './pokedex-app.component.html',
  styleUrls: ['./pokedex-app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PokedexAppComponent {
  isDarkMode = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }
}
