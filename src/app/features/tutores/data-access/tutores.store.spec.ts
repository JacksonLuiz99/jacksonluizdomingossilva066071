import { TutoresStore } from "./tutores.store";
import { initialTutoresState } from "./tutores.models";

describe("TutoresStore", () => {
  it("deve iniciar com estado inicial", () => {
    const store = new TutoresStore();
    expect(store.snapshot).toEqual(initialTutoresState);
  });

  it("patch deve atualizar estado de forma imutável", () => {
    const store = new TutoresStore();
    store.patch({ loadingDetail: true, error: null });
    expect(store.snapshot.loadingDetail).toBe(true);
    expect(store.snapshot.error).toBeNull();
  });

  it("setSelected deve definir tutor selecionado", () => {
    const store = new TutoresStore();
    const tutor = {
      id: 1,
      nome: "Maria Silva",
      telefone: "(65) 99999-9999",
      endereco: "Rua A, 123",
      pets: [],
    };
    store.setSelected(tutor);
    expect(store.snapshot.selected).toEqual(tutor);
  });

  it("setSelected deve limpar tutor selecionado", () => {
    const store = new TutoresStore();
    const tutor = {
      id: 1,
      nome: "Maria Silva",
      telefone: "(65) 99999-9999",
      endereco: "Rua A, 123",
      pets: [],
    };
    store.setSelected(tutor);
    store.setSelected(null);
    expect(store.snapshot.selected).toBeNull();
  });
});
