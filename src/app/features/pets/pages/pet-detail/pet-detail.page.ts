import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';

import { PetsFacade } from '../../data-access/pets.facade';
import { PhotoUploadComponent } from '../../../../shared/components/photo-upload/photo-upload.component';
import { ConfirmDialogComponent } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    PhotoUploadComponent,
  ],
  templateUrl: './pet-detail.page.html',
  styleUrl: './pet-detail.page.scss',
})
export class PetDetailPage {
  facade = inject(PetsFacade);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  petId = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit() {
    this.facade.loadPetDetail(this.petId).subscribe();
  }

  uploadPhoto(id: number, file: File) {
    this.facade.uploadPetPhoto(id, file).subscribe(() => {
      this.facade.loadPetDetail(id).subscribe();
    });
  }

  confirmDelete() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Pet',
        message:
          'Tem certeza que deseja excluir este pet? Esta ação não pode ser desfeita.',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        isDanger: true,
      },
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        this.facade
          .deletePet(this.petId)
          .subscribe(() => this.router.navigateByUrl('/pets'));
      }
    });
  }

  deletePetPhoto(petId: number, photoId: number) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Foto',
        message: 'Tem certeza que deseja excluir a foto deste pet?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        isDanger: true,
      },
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        this.facade
          .deletePetPhoto(petId, photoId)
          .subscribe(() => this.facade.loadPetDetail(petId).subscribe());
      }
    });
  }
}
