import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { TutoresApiService } from '../../data-access/tutores-api.service';
import { ConfirmDialogComponent } from '../../../../core/ui/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './tutores-list.page.html',
  styleUrl: './tutores-list.page.scss',
})
export class TutoresListPage {
  private api = inject(TutoresApiService);
  private dialog = inject(MatDialog);

  tutores: any[] = [];
  loading = true;
  total = 0;
  page = 1;
  size = 10;
  pageIndex = 0;
  searchControl = new FormControl('');

  ngOnInit() {
    this.loadTutores();
    this.setupSearch();
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.page = 1;
        this.pageIndex = 0;
        this.loadTutores();
      });
  }

  loadTutores() {
    this.loading = true;
    const query = this.searchControl.value || '';
    this.api.list(this.page, this.size, query).subscribe({
      next: (response) => {
        this.tutores = response.items;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.size = event.pageSize;
    this.loadTutores();
  }

  deleteTutor(event: Event, tutor: any) {
    event.preventDefault();
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Tutor',
        message: `Tem certeza que deseja excluir o tutor "${tutor.nome}"? Esta ação não pode ser desfeita.`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        isDanger: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        console.log('Excluir tutor:', tutor.id);
      }
    });
  }
}
