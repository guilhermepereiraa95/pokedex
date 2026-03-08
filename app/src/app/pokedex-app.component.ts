import { Component, Renderer2, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pokedex',
  templateUrl: './pokedex-app.component.html',
  styleUrls: ['./pokedex-app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PokedexAppComponent {
  private document = inject<Document>(DOCUMENT);
  private renderer = inject(Renderer2);

  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }
}
