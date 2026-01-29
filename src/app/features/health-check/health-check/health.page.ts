import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, timer, forkJoin } from 'rxjs';
import { filter, switchMap, takeUntil, take, tap } from 'rxjs/operators';

import { HealthService, CheckResult } from '../health.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './health.page.html',
})
export class HealthPage implements OnDestroy {
  private service = inject(HealthService);

  live: CheckResult = this.service.liveness();
  ready: CheckResult | null = null;
  health: CheckResult | null = null;
  meta = this.service.meta();

  loading = false;

  autoRefresh = true;
  private refresh$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Timer roda a cada 30 segundos se autoRefresh for true
    timer(0, 30000)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.autoRefresh),
        switchMap(() => this.runChecks()),
      )
      .subscribe();

    // Permite forçar refresh manual
    this.refresh$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.runChecks()),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleAutoRefresh() {
    this.autoRefresh = !this.autoRefresh;
  }

  forceRefresh() {
    this.refresh$.next();
  }

  private runChecks() {
    this.loading = true;
    this.live = this.service.liveness();
    return forkJoin({
      ready: this.service.readiness().pipe(
        // Garante que o observable complete para o forkJoin
        take(1),
      ),
      // Recalcular liveness é instantâneo
    }).pipe(
      tap(({ ready }) => {
        this.loading = false;
        this.ready = ready;
        // Derivar health do ready atual e liveness
        const ok = this.live.ok && ready.ok;
        this.health = {
          ok,
          message: ok ? 'HEALTH OK' : 'Check Fail',
          latency: ready.latency,
          timestamp: ready.timestamp,
        };
      }),
    );
  }
}
