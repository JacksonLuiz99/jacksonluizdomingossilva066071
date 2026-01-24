import { AnexoResponseDto } from "../../pets/data-access/pets.models";

export interface Tutor {
  id: number;
  nome: string;
  email?: string;
  telefone: string;
  endereco: string;
  cpf?: number;
  foto?: AnexoResponseDto | null;
  pets?: Array<{
    id: number;
    nome: string;
    raca: string;
    idade: number;
    foto?: AnexoResponseDto | null;
  }>;
}

export interface TutorCreateDto {
  nome: string;
  email?: string;
  telefone: string;
  endereco: string;
  cpf?: number;
}

export interface TutorUpdateDto extends TutorCreateDto {}

export interface TutoresState {
  selected: Tutor | null;

  loadingDetail: boolean;
  saving: boolean;
  uploadingPhoto: boolean;

  error: string | null;
}

export const initialTutoresState: TutoresState = {
  selected: null,
  loadingDetail: false,
  saving: false,
  uploadingPhoto: false,
  error: null,
};
