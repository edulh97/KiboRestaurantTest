import { render, screen, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import BackButton from "./BackButton"; // Componente del botón "Back"
import { describe, expect, test } from "vitest";

describe('Back test', () => {
    test('funciona el back xd', () => {
        const historialSimulado = createMemoryHistory();

        historialSimulado.push('/');
        historialSimulado.push('/Home');
        historialSimulado.push('/Login-Menu');
        historialSimulado.push('/Main-Menu');

        render(
            <Router navigator={historialSimulado} location={historialSimulado.location}>
                <BackButton />
            </Router>
        );

        expect(historialSimulado.location.pathname).toBe('/Main-Menu');

        const backButton = screen.getByTestId("back-button-test");
        fireEvent.click(backButton);

        expect(historialSimulado.location.pathname).toBe('/Login-Menu');

        fireEvent.click(backButton);
        expect(historialSimulado.location.pathname).toBe('/Home');

        fireEvent.click(backButton);
        expect(historialSimulado.location.pathname).toBe('/');
    });
});
