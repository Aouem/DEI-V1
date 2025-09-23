import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import localeFr from '@angular/common/locales/fr';

// Components standalone
import { EvenementDetailComponent } from './components/evenement-detail/evenement-detail';
import { IncidentFormComponent } from './components/incident-form/incident-form';
import { IncidentListComponent } from './components/incident-list/incident-list';
import { ConfirmationComponent } from './components/confirmation/confirmation';
import { UserForm } from './components/user-form/user-form';
import { ServicesComponent } from './components/services/services';
import { QuestionsListComponent } from './components/questions-list-component/questions-list-component';
import { LoginComponent } from './components/login/login';

import { AuthInterceptor } from './services/auth.interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HomeButtonComponent } from './compoenets/home-button/home-button';
import { IncidentDetailExtraComponent } from './components/incident-detail-extra/incident-detail-extra';

// Enregistrer le locale français
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    App,
    HomeButtonComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
        IncidentDetailExtraComponent,
    RouterModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Composants standalone
    EvenementDetailComponent,
    IncidentFormComponent,
    IncidentListComponent,
    ConfirmationComponent,
    UserForm,
    ServicesComponent,
    QuestionsListComponent
  ],
    exports: [HomeButtonComponent],  // pour pouvoir l'utiliser ailleurs

  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    JwtHelperService
  ],
  bootstrap: [App]
})
export class AppModule {}
