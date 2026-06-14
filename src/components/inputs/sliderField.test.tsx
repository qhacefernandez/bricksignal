/**
 * @vitest-environment jsdom
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import SliderField from './SliderField';

describe('SliderField', () => {
  it('syncs input blur to onChange', () => {
    const onChange = vi.fn();
    render(
      <SliderField
        id="test"
        label="Precio"
        value={100_000}
        onChange={onChange}
        range={{ min: 50_000, max: 600_000, step: 5_000, defaultValue: 180_000 }}
        formatDisplay={(v) => String(v)}
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '200000' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(200_000);
  });

  it('has accessible label', () => {
    render(
      <SliderField
        id="rent"
        label="Alquiler mensual"
        value={950}
        onChange={() => {}}
        range={{ min: 300, max: 3000, step: 25, defaultValue: 950 }}
        formatDisplay={(v) => String(v)}
      />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('fires onChange when native range moves', () => {
    const onChange = vi.fn();
    render(
      <SliderField
        id="price"
        label="Precio"
        value={100_000}
        onChange={onChange}
        range={{ min: 50_000, max: 600_000, step: 5_000, defaultValue: 100_000 }}
        formatDisplay={(v) => String(v)}
      />,
    );
    const slider = screen.getByRole('slider');
    fireEvent.input(slider, { target: { value: '150000' } });
    expect(onChange).toHaveBeenCalledWith(150_000);
  });
});
