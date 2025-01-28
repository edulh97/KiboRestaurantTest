import { vi, expect, test, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Route, Router, Routes } from "react-router-dom";
import { createMemoryHistory } from "history";
import Home from "./Home"; // Componente inicial
import LoginMenu from "../login-menu/LoginMenu";

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
});

test("testeo de carga por links", () => {
    const history = createMemoryHistory({ initialEntries: ["/Home"] });

    render(
        <Router location={history.location} navigator={history}>
            <Home />
        </Router>
    );

    expect(history.location.pathname).toBe("/Home");

    act(() => {
        vi.advanceTimersByTime(1000);
    });

    expect(history.location.pathname).toBe("/Login-Menu");
});

test('testeo de carga por componente renderizado', async () => {
    render(
        <MemoryRouter initialEntries={['/Home']}>
            <Routes>
                <Route path="/Home" element={<Home />} />
                <Route path="/Login-Menu" element={<LoginMenu />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByAltText('Kibo')).toBeInTheDocument();

    act(() => {
        vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Log in')).toBeInTheDocument();
});