import { Component, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TutoresFacade } from '../../data-access/tutores.facade';
import { PetsFacade } from '../../../pets/data-access/pets.facade';
import { Pet } from '../../../pets/data-access/pets.models';
import { PhotoUploadComponent } from '../../../../shared/components/photo-upload/photo-upload.component';
import { ConfirmDialogComponent } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { map, startWith } from 'rxjs';

import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { AddressActionsSheetComponent } from '../../../../shared/components/address-actions-sheet/address-actions-sheet.component';

@Component({
  selector: 'app-tutor-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    PhotoUploadComponent,
  ],
  templateUrl: './tutor-detail.page.html',
  styleUrls: ['./tutor-detail.page.scss'],
})
export class TutorDetailPage {
  facade = inject(TutoresFacade);
  petsFacade = inject(PetsFacade);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private bottomSheet = inject(MatBottomSheet);
  private router = inject(Router);

  tutorId = Number(this.route.snapshot.paramMap.get('id'));

  linkForm = this.fb.group({
    petSearch: [null as Pet | null, Validators.required],
  });

  allPets: Pet[] = []; // Lista completa de pets

  // Observable para filtrar pets baseado no input
  filteredPets$ = this.linkForm.controls.petSearch.valueChanges.pipe(
    startWith(''),
    map((value) => {
      const searchText = typeof value === 'string' ? value : value?.nome || '';
      return this._filterPets(searchText);
    }),
  );

  ngOnInit() {
    this.facade.loadTutorDetail(this.tutorId).subscribe();
    // Carregar TODOS os pets (sem paginação) para o autocomplete
    this.petsFacade.loadAllPets().subscribe((pets) => {
      this.allPets = pets;
    });
  }

  uploadTutorPhoto(id: number, file: File) {
    this.facade
      .uploadTutorPhoto(id, file)
      .subscribe(() => this.facade.loadTutorDetail(id).subscribe());
  }

  vincular(tutorId: number) {
    const selectedPet = this.linkForm.value.petSearch as Pet | null;
    if (!selectedPet?.id) return;

    this.facade.vincularPet(tutorId, selectedPet.id).subscribe(() => {
      this.facade.loadTutorDetail(tutorId).subscribe();
      this.linkForm.reset(); // Limpar o campo após vincular
    });
  }

  remover(tutorId: number, petId: number, petNome: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remover Vínculo',
        message: `Tem certeza que deseja remover o vínculo com "${petNome}"? O pet não será excluído, apenas o vínculo com este tutor.`,
        confirmText: 'Remover',
        cancelText: 'Cancelar',
        isDanger: true,
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        this.facade
          .removerVinculo(tutorId, petId)
          .subscribe(() => this.facade.loadTutorDetail(tutorId).subscribe());
      }
    });
  }

  confirmPhone(phone: string) {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Ligar para Tutor',
        message: `Deseja ligar para o número ${phone}?`,
        confirmText: 'Ligar',
        cancelText: 'Cancelar',
        isDanger: false,
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        window.open(`tel:${cleanPhone}`, '_self');
      }
    });
  }

  confirmEmail(email: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Enviar Email',
        message: `Deseja enviar um email para ${email}?`,
        confirmText: 'Enviar Email',
        cancelText: 'Cancelar',
        isDanger: false,
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        window.open(`mailto:${email}`, '_self');
      }
    });
  }

  openAddressOptions(address: string) {
    this.bottomSheet.open(AddressActionsSheetComponent, {
      data: { address: address },
    });
  }

  confirmDelete() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Tutor',
        message:
          'Tem certeza que deseja excluir este tutor? Esta ação não pode ser desfeita.',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        isDanger: true,
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        this.facade
          .deleteTutor(this.tutorId)
          .subscribe(() => this.router.navigateByUrl('/tutores'));
      }
    });
  }

  deleteTutorPhoto(tutorId: number, photoId: number) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Foto',
        message: 'Tem certeza que deseja excluir a foto deste tutor?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        isDanger: true,
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        this.facade
          .deleteTutorPhoto(tutorId, photoId)
          .subscribe(() => this.facade.loadTutorDetail(tutorId).subscribe());
      }
    });
  }

  // Função para exibir o nome do pet no campo de input
  displayPetName = (pet: Pet | null): string => {
    return pet?.nome || '';
  };

  // Função privada para filtrar pets
  private _filterPets(searchText: string): Pet[] {
    if (!this.allPets || this.allPets.length === 0) return [];

    const filterValue = searchText.toLowerCase();
    return this.allPets.filter(
      (pet) =>
        pet.nome.toLowerCase().includes(filterValue) ||
        pet.raca?.toLowerCase().includes(filterValue),
    );
  }
}
