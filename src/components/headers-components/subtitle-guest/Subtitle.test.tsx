import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Subtitle from "./Subtitle.tsx";

describe('Testeo de h1 y h2', () => {
    test('renders the subtitle texts', () => {
        render(<Subtitle />);
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
});