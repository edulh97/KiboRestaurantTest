import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import '@testing-library/jest-dom';
import LocationRestaurantMap from './LocationRestaurantMap';

describe('LocationRestaurantMap Component', () => {
  test('verifica si la imagen se carga correctamente', () => {

    render(<LocationRestaurantMap />);

    const imagenMapaRestaurante = screen.getByAltText(/map/i);
    fireEvent.load(imagenMapaRestaurante);

    expect(imagenMapaRestaurante).toBeInTheDocument();
    console.log("Imagen cargada correctamente");
  });

  test('verifica el manejo de error cuando la imagen no se carga', () => {
    render(<LocationRestaurantMap />);

    const mapImage = screen.getByAltText(/map/i);
    fireEvent.error(mapImage);

    expect(mapImage).toBeInTheDocument();

    console.error("No carga xd");
  });
});