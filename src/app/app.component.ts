import { Component, inject } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFacade } from './core/auth/auth.facade';
import { AppConfigService } from './core/config/app-config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  auth = inject(AuthFacade);
  private router = inject(Router);
  private config = inject(AppConfigService);

  get appVersion(): string {
    return this.config.config.APP_VERSION;
  }

  get isLoggedIn(): boolean {
    return !window.location.pathname.includes('/login');
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
