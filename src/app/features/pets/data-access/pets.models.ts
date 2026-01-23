// Interface que representa o anexo/foto retornado pela API
export interface AnexoResponseDto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: AnexoResponseDto | null;
  tutores?: Array<{
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    cpf?: number;
    foto?: AnexoResponseDto | null;
  }>;
}

export interface PetCreateDto {
  nome: string;
  raca: string;
  idade: number;
}

export interface PetUpdateDto extends PetCreateDto {}

export interface PetsState {
  items: Pet[];
  total: number;
  page: number;
  size: number; 
  query: string;

  selected: Pet | null;
  selectedTutor: {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    foto?: AnexoResponseDto | null;
  } | null;

  loadingList: boolean;
  loadingDetail: boolean;
  saving: boolean;
  uploadingPhoto: boolean;

  error: string | null;
}

export const initialPetsState: PetsState = {
  items: [],
  total: 0,
  page: 1,
  size: 10,
  query: "",

  selected: null,
  selectedTutor: null,

  loadingList: false,
  loadingDetail: false,
  saving: false,
  uploadingPhoto: false,

  error: null,
};
