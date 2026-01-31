import { TestBed } from '@angular/core/testing';
import { PetsFacade } from './pets.facade';
import { PetsStore } from './pets.store';
import { PetsApiService } from './pets-api.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { of, throwError } from 'rxjs';
import { Pet } from './pets.models';

describe('PetsFacade', () => {
  let facade: PetsFacade;
  let store: PetsStore;
  let apiMock: jasmine.SpyObj<PetsApiService>;
  let snackMock: jasmine.SpyObj<SnackbarService>;

  beforeEach(() => {
    apiMock = jasmine.createSpyObj('PetsApiService', [
      'list',
      'getById',
      'create',
      'update',
      'delete',
      'uploadPhoto',
      'deletePhoto',
      'listAll',
    ]);

    snackMock = jasmine.createSpyObj('SnackbarService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [PetsStore],
    });

    // Override providers para a facade
    TestBed.overrideProvider(PetsApiService, { useValue: apiMock });
    TestBed.overrideProvider(SnackbarService, { useValue: snackMock });

    store = TestBed.inject(PetsStore);
    facade = TestBed.inject(PetsFacade);
  });

  it('loadPets deve chamar api.list com parâmetros corretos', () => {
    const mockResponse = {
      items: [{ id: 1, nome: 'Luna', idade: 2, raca: 'SRD' } as Pet],
      total: 1,
      page: 1,
      size: 10,
    };
    apiMock.list.and.returnValue(of(mockResponse));

    facade.loadPets().subscribe();

    expect(apiMock.list).toHaveBeenCalledWith(1, 10, '');
  });

  it('loadPets deve preencher store em sucesso', (done) => {
    const mockResponse = {
      items: [{ id: 1, nome: 'Luna', idade: 2, raca: 'SRD' } as Pet],
      total: 1,
      page: 1,
      size: 10,
    };
    apiMock.list.and.returnValue(of(mockResponse));

    facade.loadPets().subscribe({
      complete: () => {
        expect(store.snapshot.items.length).toBe(1);
        expect(store.snapshot.total).toBe(1);
        done();
      },
    });
  });

  it('createPet deve adicionar pet ao store e exibir snackbar de sucesso', (done) => {
    const newPet: Pet = {
      id: 99,
      nome: 'Bob',
      idade: 3,
      raca: 'Labrador',
    };
    apiMock.create.and.returnValue(of(newPet));

    facade
      .createPet({
        nome: 'Bob',
        idade: 3,
        raca: 'Labrador',
      })
      .subscribe({
        complete: () => {
          expect(store.snapshot.items.some((p) => p.id === 99)).toBe(true);
          expect(snackMock.success).toHaveBeenCalledWith(
            'Pet criado com sucesso.',
          );
          done();
        },
      });
  });

  it('deletePet deve remover pet do store e exibir snackbar de sucesso', (done) => {
    // Setup inicial com um pet
    store.patch({
      items: [{ id: 1, nome: 'Luna', idade: 2, raca: 'SRD' } as Pet],
    });
    apiMock.delete.and.returnValue(of(undefined));

    facade.deletePet(1).subscribe({
      complete: () => {
        expect(store.snapshot.items.length).toBe(0);
        expect(snackMock.success).toHaveBeenCalledWith(
          'Pet excluído com sucesso.',
        );
        done();
      },
    });
  });
});
