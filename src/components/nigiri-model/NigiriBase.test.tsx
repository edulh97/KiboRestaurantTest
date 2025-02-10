import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';
import { OrderProvider } from '../../context/OrderContext';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { BrowserRouter } from "react-router-dom";
import Nigiri1 from '../../pages/Nigiris/Nigiri1';

describe('Me Gusta, No me gusta, Me gusta, No me gusta....', () => {
    test('que se pueda dar y quitar el me gusta 😳', () => {
        render(
            <FavoritesProvider>
                <OrderProvider>
                    <BrowserRouter>
                        <Nigiri1 />
                    </BrowserRouter>
                </OrderProvider>
            </FavoritesProvider>
        );
        const likeButton = screen.getByText('🤍');

        fireEvent.click(likeButton);
        expect(screen.getByText('❤️')).toBeInTheDocument();

        fireEvent.click(likeButton);
        expect(screen.getByText('🤍')).toBeInTheDocument();
    });
    test('que se se pueda dar no gusta 😔', () => {
        render(
            <FavoritesProvider>
                <OrderProvider>
                    <BrowserRouter>
                        <Nigiri1 />
                    </BrowserRouter>
                </OrderProvider>
            </FavoritesProvider>
        );
        const likeButton = screen.getByText('👎');

        fireEvent.click(likeButton);
        expect(screen.getByText('❌')).toBeInTheDocument();

        fireEvent.click(likeButton);
        expect(screen.getByText('👎')).toBeInTheDocument();
    });
    test('que no estan activos los dos a la vez 🤪 xdd', () => {
        render(
            <FavoritesProvider>
                <OrderProvider>
                    <BrowserRouter>
                        <Nigiri1 />
                    </BrowserRouter>
                </OrderProvider>
            </FavoritesProvider>
        );

        const likeButton = screen.getByText('🤍');
        const dislikeButton = screen.getByText('👎');

        fireEvent.click(likeButton);
        expect(screen.getByText('❤️')).toBeInTheDocument();
        expect(screen.getByText('👎')).toBeInTheDocument();

        fireEvent.click(dislikeButton);
        expect(screen.getByText('🤍')).toBeInTheDocument();
        expect(screen.getByText('❌')).toBeInTheDocument();
    });
});

describe("Control de cantidad y calidad", () => {
    let quantity = 0;

    const handleQuantityChange = (delta: number) => {
        quantity = Math.max(0, quantity + delta);
    };

    beforeEach(() => {
        quantity = 0;
    });

    test("incrementa la cantidad", () => {
        handleQuantityChange(4);
        expect(quantity).toBe(4);
    });

    test("decrementa la cantidad", () => {
        handleQuantityChange(50000);
        handleQuantityChange(-49999);
        expect(quantity).toBe(1);
    });

    test("no negative allow", () => {
        handleQuantityChange(-8237821738);
        expect(quantity).toBe(0);
    });

});


const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const originalModule = await vi.importActual("react-router-dom");
    return {
        ...originalModule,
        useNavigate: () => mockNavigate,
    };
});