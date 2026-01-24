import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TutoresFacade } from '../../data-access/tutores.facade';
import { CepService } from '../../../../shared/components/services/cep.service';
import { SnackbarService } from '../../../../core/ui/snackbar.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tutor-form.page.html',
  styleUrl: './tutor-form.page.scss',
})
export class TutorFormPage {
  facade = inject(TutoresFacade);
  cepService = inject(CepService);
  snackbar = inject(SnackbarService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = this.route.snapshot.paramMap.get('id');
  isEdit = !!this.id;
  loadingCep = false;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
    telefone: ['', [Validators.required]],
    cpf: ['', [Validators.minLength(11)]],

    // endereço
    cep: ['', [Validators.required, Validators.minLength(8)]],
    logradouro: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    estado: ['', [Validators.required]],
  });

  ngOnInit() {
    if (this.isEdit) {
      this.facade.loadTutorDetail(Number(this.id)).subscribe((t) => {
        if (!t) return;

        this.form.patchValue({
          nome: t.nome,
          email: t.email || '',
          telefone: t.telefone,
          cpf: t.cpf ? String(t.cpf) : '',
          logradouro: t.endereco,
          // Mantendo compatibilidade: se for endereço antigo, coloca no logradouro para o usuário editar
        });
      });
    }
  }

  buscarCep() {
    const cep = this.form.get('cep')?.value;
    if (!cep || cep.length < 8) return;

    this.loadingCep = true;
    this.cepService.consultarCep(cep).subscribe({
      next: (data) => {
        this.loadingCep = false;
        this.form.patchValue({
          logradouro: data.street,
          bairro: data.neighborhood,
          cidade: data.city,
          estado: data.state,
        });
        this.snackbar.success('Endereço encontrado!');
      },
      error: (err) => {
        this.loadingCep = false;
        this.snackbar.error('CEP não encontrado ou serviço indisponível.');
        console.error(err);
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formVal = this.form.value;

    // Concatena endereço
    const enderecoCompleto = `${formVal.logradouro}, ${formVal.numero}
     - ${formVal.bairro}, ${formVal.cidade}/${formVal.estado}
     . CEP: ${formVal.cep}`;

    const dto: any = {
      nome: formVal.nome,
      email: formVal.email,
      telefone: formVal.telefone ? formVal.telefone.replace(/\D/g, '') : '',
      endereco: enderecoCompleto,
      cpf: formVal.cpf ? formVal.cpf.toString().replace(/\D/g, '') : null,
    };

    if (this.isEdit) {
      this.facade.updateTutor(Number(this.id), dto).subscribe((tutor) => {
        if (tutor) this.router.navigateByUrl(`/tutores/${tutor.id}`);
      });
    } else {
      this.facade.createTutor(dto).subscribe((tutor: any) => {
        if (tutor?.id) this.router.navigateByUrl(`/tutores/${tutor.id}`);
        else this.router.navigateByUrl('/tutores');
      });
    }
  }
}
