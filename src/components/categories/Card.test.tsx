import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Cards from "./Card";

describe('Tarjetas del menu xd', () => {
    test('se cargan todas las tarjetas xd', () => {
        render(
            <BrowserRouter>
                <Cards />
            </BrowserRouter>
        );

        expect(screen.getByTestId('card-container')).toBeInTheDocument();
        expect(screen.getByTestId('card-top')).toBeInTheDocument();
        expect(screen.getByTestId('card-nigiris')).toBeInTheDocument();
        expect(screen.getByTestId('card-makis')).toBeInTheDocument();
        expect(screen.getByTestId('card-favs')).toBeInTheDocument();
    });

    test('se cargan los titulos de las tarjetas xd', () => {
        render(
            <BrowserRouter>
                <Cards />
            </BrowserRouter>
        );

        expect(screen.getByText('TOP SELLER')).toBeInTheDocument();
        expect(screen.getByText('NIGIRIS')).toBeInTheDocument();
        expect(screen.getByText('MAKIS')).toBeInTheDocument();
        expect(screen.getByText('YOUR FAVS!')).toBeInTheDocument();
    });

    test('se cargan las imagenes de las tarjetas xd', () => {
        render(
            <BrowserRouter>
                <Cards />
            </BrowserRouter>
        );

        //Tarjeta de top seller
        const topSellerImage = screen.getByTestId('fav-image');
        const topCard = screen.getByTestId("card-top");
        expect(topCard).toHaveClass("Category-card");
        expect(topSellerImage).toBeInTheDocument();
        expect(topSellerImage).toHaveAttribute('src', '/TopSellerIcon.png');
        expect(topSellerImage).toHaveAttribute('alt', 'Icono de fama en japones');

        //Tarjeta de Nigiris xd
        const NigirisImagen = screen.getByTestId('nigiris-image');
        const nigirisCard = screen.getByTestId("card-nigiris");
        expect(nigirisCard).toHaveClass("Category-card-nigiris");
        expect(NigirisImagen).toBeInTheDocument();
        expect(NigirisImagen).toHaveAttribute('src', '/nigiris.png');
        expect(NigirisImagen).toHaveAttribute('alt', 'Nigiri de salmon');

        //Los makis xd
        const makisImage = screen.getByTestId('makis-image');
        const makisCard = screen.getByTestId("card-makis");
        expect(makisCard).toHaveClass("Category-card-makis");
        expect(makisImage).toBeInTheDocument();
        expect(makisImage).toHaveAttribute('src', '/makis.png');
        expect(makisImage).toHaveAttribute('alt', 'Makis de salmon y aguacate');

        const favImage = screen.getByTestId('favs-image');
        const favCard = screen.getByTestId("card-favs");
        expect(favCard).toHaveClass("Category-card-favs");
        expect(favImage).toBeInTheDocument();
        expect(favImage).toHaveAttribute('src', '/favsicon.png');
        expect(favImage).toHaveAttribute('alt', 'Bandeja de sushi');
    });

    test('navegacion hacia la seccion de nigiris xd', () => {
        render(
            <BrowserRouter>
                <Cards />
            </BrowserRouter>
        );

        const nigirisCard = screen.getByTestId('card-nigiris');
        fireEvent.click(nigirisCard);
        expect(window.location.pathname).toBe("/youtube.es");
    });

    test('que vaya a tus favs xd', () => {
        render(
            <BrowserRouter>
                <Cards />
            </BrowserRouter>
        );

        const tarjetaFav = screen.getByTestId('card-favs');
        fireEvent.click(tarjetaFav);
        expect(window.location.pathname).toBe("/Favorites");
    });

});