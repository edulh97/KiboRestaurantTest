import { getUsers } from './api';
import { describe, expect, vi, beforeEach, test } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import User from '../pages/Users/Usuarios';
import type { Usuario } from '../pages/Users/Usuario-model';


describe('getUsers', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Limpia todos los mocks antes de cada prueba.
  });

  test("renderiza los usuarios de la api xd", async () => {
    const data = await getUsers();
    render(<User />);

    await waitFor(() => {
      data.forEach((usuario: Usuario) => {
        expect(screen.getByText(usuario.nombreCompleto)).toBeInTheDocument();
      });
    });
  });

  test('debería devolver los datos de los usuarios mockeados xd', async () => {

    const mockData = [{ id: 1, name: 'Nira Testing' }, { id: 2, name: 'Miguel Testing' }];
    const realData = await getUsers();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      } as Response),
    );

    const result = await getUsers();

    expect(result).toEqual(realData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/kibo/usuarios');
  });

  test('debería lanzar un error si fetch falla xd', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));
    await expect(getUsers()).rejects.toThrow('Network Error');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/kibo/usuarios');
  });
});