import { TestBed } from '@angular/core/testing';
import { PetsFacade } from './pets.facade';
import { PetsStore } from './pets.store';
import { PetsApiService } from './pets-api.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { of, throwError } from 'rxjs';

describe('PetsFacade', () => {
  let facade: PetsFacade;
  let api: jasmine.SpyObj<PetsApiService>;
  let store: PetsStore;

  beforeEach(() => {
    api = jasmine.createSpyObj('PetsApiService', [
      'list',
      'getById',
      'create',
      'update',
      'delete',
      'uploadPhoto',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PetsFacade,
        PetsStore,
        { provide: PetsApiService, useValue: api },
        {
          provide: SnackbarService,
          useValue: { success: () => {}, error: () => {} },
        },
      ],
    });

    facade = TestBed.inject(PetsFacade);
    store = TestBed.inject(PetsStore);
  });

  it('loadPets deve preencher items/total e desligar loading', (done) => {
    api.list.and.returnValue(
      of({
        items: [
          { id: 1, nome: 'Luna', idade: 2, raca: 'SRD' },
        ],
        total: 1,
        page: 1,
        size: 10,
      }),
    );
    facade.loadPets().subscribe(() => {
      expect(store.snapshot.items.length).toBe(1);
      expect(store.snapshot.total).toBe(1);
      expect(store.snapshot.loadingList).toBe(false);
      done();
    });
    expect(store.snapshot.loadingList).toBe(true);
  });

  it('loadPets deve setar error em falha', (done) => {
    api.list.and.returnValue(
      throwError(() => ({ error: { message: 'boom' } })),
    );
    facade.loadPets().subscribe(() => {
      expect(store.snapshot.error).toBe('boom');
      done();
    });
  });

  it('createPet deve adicionar pet ao store em sucesso', (done) => {
    const newPet = {
      id: 99,
      nome: 'Bob',
      idade: 3,
      raca: 'Labrador',
    };
    api.create.and.returnValue(of(newPet));
    facade
      .createPet({
        nome: 'Bob',
        idade: 3,
        raca: 'Labrador',
      })
      .subscribe(() => {
        expect(store.snapshot.items.some((p) => p.id === 99)).toBe(true);
        done();
      });
  });
});
