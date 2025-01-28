import { describe, expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { faker } from '@faker-js/faker';
import LoginOrderForm from './LoginOrderForm';

describe('LoginOrderForm testing', () => {
  test('empty correo login xd', async () => {
    render(<LoginOrderForm />);

    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/por favor, introduce tu correo electrónico\./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('muestra el mensaje de error si el formato del correo no es válido', async () => {
    render(<LoginOrderForm />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: 'hello.world' } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/por favor, introduce un correo electrónico válido\./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('no muestra errores si el correo electrónico es válido', async () => {
    render(<LoginOrderForm />);

    const fakerEmail = faker.internet.email();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: fakerEmail } });
    fireEvent.click(submitButton);

    const errorMessage = screen.queryByText(/por favor, introduce un correo electrónico válido\./i);
    expect(errorMessage).not.toBeInTheDocument();
  });
});
