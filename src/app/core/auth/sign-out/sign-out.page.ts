import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthFacade } from '../auth.facade';

@Component({
  selector: 'app-sign-out',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sign-out.page.html',
  styleUrl: './sign-out.page.scss',
})
export class SignOutPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private auth = inject(AuthFacade);

  countdown = 5;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.auth.logout();

    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.goToLogin();
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  goToLogin() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.router.navigateByUrl('/login');
  }
}
