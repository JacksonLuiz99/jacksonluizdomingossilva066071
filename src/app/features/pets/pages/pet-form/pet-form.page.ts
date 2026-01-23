import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PetsFacade } from '../../data-access/pets.facade';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './pet-form.page.html',
})
export class PetFormPage {
  facade = inject(PetsFacade);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = false;
  petId = 0;

  form = this.fb.group({
    nome: ['', Validators.required],
    raca: ['', Validators.required],
    idade: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.petId = Number(id);
      this.facade.loadPetDetail(this.petId).subscribe((pet) => {
        if (pet) {
          this.form.patchValue({
            nome: pet.nome,
            raca: pet.raca,
            idade: pet.idade,
          });
        }
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    const dto = this.form.value as any;

    if (this.isEdit) {
      this.facade.updatePet(this.petId, dto).subscribe((pet) => {
        if (pet) this.router.navigateByUrl(`/pets/${pet.id}`);
      });
    } else {
      this.facade.createPet(dto).subscribe((pet) => {
        if (pet?.id) {
          this.router.navigateByUrl(`/pets/${pet.id}`);
        } else {
          // Se a criação falhou, voltar para a lista de pets
          this.router.navigateByUrl('/pets');
        }
      });
    }
  }
}
