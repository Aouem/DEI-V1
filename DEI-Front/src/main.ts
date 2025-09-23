import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

platformBrowser().bootstrapModule(AppModule, {

})
  .catch(err => console.error(err));
// This file is the entry point for the Angular application.
