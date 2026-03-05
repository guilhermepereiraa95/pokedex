import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { PokedexAppComponent } from './app/pokedex-app.component';
import { routes } from './app/pokedex-app.routes';

bootstrapApplication(PokedexAppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
})
  .catch((err) => console.error(err));
