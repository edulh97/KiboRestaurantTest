import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginSubtitle from "./LoginSubtitle.tsx";

describe('LoginSubtitle Component', () => {
    test('renders the login subtitle texts', () => {
        render(<LoginSubtitle />);
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("We are pleased to see you again")).toBeInTheDocument();
    });
});