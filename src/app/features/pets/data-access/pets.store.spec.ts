import { PetsStore } from './pets.store';
import { initialPetsState, Pet } from './pets.models';

describe('PetsStore', () => {
  it('deve iniciar com estado inicial', () => {
    const store = new PetsStore();
    expect(store.snapshot).toEqual(initialPetsState);
  });

  it('patch deve atualizar estado de forma imutável', () => {
    const store = new PetsStore();
    store.patch({ page: 2, query: 'luna' });
    expect(store.snapshot.page).toBe(2);
    expect(store.snapshot.query).toBe('luna');
  });

  it('upsertItem deve adicionar novo item', () => {
    const store = new PetsStore();
    const pet: Pet = { id: 1, nome: 'Luna', idade: 2, raca: 'SRD' };
    store.upsertItem(pet);
    expect(store.snapshot.items.length).toBe(1);
    expect(store.snapshot.items[0]).toEqual(pet);
  });

  it('upsertItem deve atualizar item existente', () => {
    const store = new PetsStore();
    const pet: Pet = { id: 1, nome: 'Luna', idade: 2, raca: 'SRD' };
    store.upsertItem(pet);

    const petAtualizado: Pet = {
      id: 1,
      nome: 'Luna Maria',
      idade: 3,
      raca: 'SRD',
    };
    store.upsertItem(petAtualizado);

    expect(store.snapshot.items.length).toBe(1);
    expect(store.snapshot.items[0].nome).toBe('Luna Maria');
    expect(store.snapshot.items[0].idade).toBe(3);
  });

  it('removeItem deve remover item por id', () => {
    const store = new PetsStore();
    store.patch({
      items: [{ id: 1, nome: 'Luna', idade: 2, raca: 'SRD' } as Pet],
    });
    store.removeItem(1);
    expect(store.snapshot.items.length).toBe(0);
  });

  it('resetSelected deve limpar pet e tutor selecionados', () => {
    const store = new PetsStore();
    store.patch({
      selected: { id: 1, nome: 'Luna', idade: 2, raca: 'SRD' } as Pet,
      selectedTutor: {
        id: 1,
        nome: 'Maria',
        telefone: '123',
        endereco: 'Rua A',
      },
      error: 'erro qualquer',
    });
    store.resetSelected();
    expect(store.snapshot.selected).toBeNull();
    expect(store.snapshot.selectedTutor).toBeNull();
    expect(store.snapshot.error).toBeNull();
  });
});
