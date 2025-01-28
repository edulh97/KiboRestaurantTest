import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header.tsx";

describe('Test Header', () => {
    test('existe el header xd', () => {
        render(<Header />);
        expect(screen.getByText("Kibō")).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getByTestId('headerid')).toBeInTheDocument();
    });
});
