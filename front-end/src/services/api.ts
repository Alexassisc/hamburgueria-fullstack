import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export async function getProducts<T = unknown>(): Promise<T[]> {
  const { data } = await api.get<T[]>('/products');
  return data;
}
