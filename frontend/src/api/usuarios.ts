import axios from 'axios';

const API_URL = 'http://localhost:3001';

// ✅ Definir tipo de Usuario (puedes mover a types.ts si quieres)
export interface Usuario {
  id: number;
  correo: string;
  rol: string;
}

// ✅ Tipar la respuesta del GET
export const listarUsuarios = () => {
  return axios.get<Usuario[]>(`${API_URL}/usuarios`);
};

export const registrarUsuario = (data: any) => {
  return axios.post(`${API_URL}/usuarios`, data);
};
