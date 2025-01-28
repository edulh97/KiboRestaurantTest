import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import LocalSummary from "../summary/Summary";
import { BrowserRouter } from "react-router-dom";

describe('No a los dobles checkbox xd', () => {

    test("picar en cada uno de ellos y no en ambos", () => {
        render(
            <BrowserRouter>
                <LocalSummary />
            </BrowserRouter>
        );

        const deliveryCheck = screen.getByTestId("delivery");
        const recogidaCheck = screen.getByTestId("recogida");

        // Al cargar (la recogida es por defecto)
        expect(deliveryCheck).not.toBeChecked();
        expect(recogidaCheck).toBeChecked();

        // Picar en delivery
        fireEvent.click(deliveryCheck);
        expect(deliveryCheck).toBeChecked();
        expect(recogidaCheck).not.toBeChecked();

        // Picar en recogida
        fireEvent.click(recogidaCheck);
        expect(deliveryCheck).not.toBeChecked();
        expect(recogidaCheck).toBeChecked();
    });

});