import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFacade } from './core/auth/auth.facade';
import { AppConfigService } from './core/config/app-config.service';
import { HeaderComponent } from './shared/components/layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'jacksonluizdomingossilva066071';
  auth = inject(AuthFacade);
  private router = inject(Router);
  private config = inject(AppConfigService);

  get appVersion(): string {
    return this.config.config.APP_VERSION;
  }

  get isLoggedIn(): boolean {
    const path = window.location.pathname;
    return !path.includes('/login') && !path.includes('/sign-out');
  }
}
