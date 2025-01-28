import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import GuestOrderForm from "./GuestOrderForm";
import { faker } from '@faker-js/faker';

describe('Formulario de invitado TEST', () => {

    test('Se carga el formulario entero xdd', () => {
        render(
            <BrowserRouter>
                <GuestOrderForm />
            </BrowserRouter>
        );
        expect(screen.getByTestId('guest-form')).toBeInTheDocument();
    });

    test('Se cargan los inputs xd', () => {
        render(
            <BrowserRouter>
                <GuestOrderForm />
            </BrowserRouter>
        );

        expect(screen.getByTestId('full-name')).toBeInTheDocument();
        expect(screen.getByTestId('email')).toBeInTheDocument();
        expect(screen.getByTestId('phone-number')).toBeInTheDocument();
        expect(screen.getByTestId('shipping-address')).toBeInTheDocument();
        expect(screen.getByTestId('credit-card')).toBeInTheDocument();
    });

    test("Se muestra y funciona el botón de continuar", () => {
        render(
            <BrowserRouter>
                <GuestOrderForm />
            </BrowserRouter>
        );
    
        const continueButton = screen.getByTestId("continue-button");
        expect(continueButton).toBeInTheDocument();
    
        const mockSubmit = vi.fn();
    
        const form = screen.getByTestId("guest-form");
        form.onsubmit = mockSubmit;
    
        fireEvent.click(continueButton);
    
        expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    test('Se muestra y funciona el link de Sign In', () => {
        render(
            <BrowserRouter>
                <GuestOrderForm />
            </BrowserRouter>
        );

        const signInLink = screen.getByText('Sign In');
        expect(screen.getByText('Already have an account?')).toBeInTheDocument();
        expect(signInLink).toBeInTheDocument();

        fireEvent.click(signInLink);
        expect(window.location.pathname).toBe("/Login-Screen");
    });

    test('Validación del campo de tarjeta de crédito con Faker', () => {
        render(
            <BrowserRouter>
                <GuestOrderForm />
            </BrowserRouter>
        );

        const fakeCreditCardNumber = faker.finance.creditCardNumber("################");
        const creditCardInput = screen.getByTestId("credit-card") as HTMLInputElement;

        fireEvent.change(creditCardInput, { target: { value: fakeCreditCardNumber } });
        expect(creditCardInput.value).toBe(fakeCreditCardNumber);
    });

    test('al entrar no estan los mensajes de errores', () => {
        render(
            <BrowserRouter>
                <GuestOrderForm />
            </BrowserRouter>
        );

        fireEvent.submit(screen.getByTestId('guest-form'));

        expect(screen.queryByText('Por favor, introduce tu nombre completo.')).not.toBeInTheDocument();
        expect(screen.queryByText('Por favor, introduce tu correo electrónico.')).not.toBeInTheDocument();
        expect(screen.queryByText('Por favor, introduce tu número de teléfono.')).not.toBeInTheDocument();
        expect(screen.queryByText('Por favor, introduce tu dirección de envío.')).not.toBeInTheDocument();
        expect(screen.queryByText('Por favor, introduce tu número de tarjeta de crédito.')).not.toBeInTheDocument();
    });
});