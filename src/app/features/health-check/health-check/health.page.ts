import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HealthService } from '../health.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './health.page.html',
})
export class HealthPage {
  private service = inject(HealthService);

  live = this.service.liveness();
  ready: any = null;
  health: any = null;
  meta = this.service.meta();

  ngOnInit() {
    this.run();
  }

  run() {
    this.service.readiness().subscribe((r) => (this.ready = r));
    this.service.health().subscribe((h) => (this.health = h));
  }
}
