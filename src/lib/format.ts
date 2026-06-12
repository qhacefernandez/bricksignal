const euroFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const euroPreciseFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatEuro(value: number, precise = false): string {
  if (!Number.isFinite(value)) return '—';
  return (precise ? euroPreciseFormatter : euroFormatter).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return numberFormatter.format(value);
}

export function parseSpanishNumber(value: string): number {
  const normalized = value.replace(/\./g, '').replace(',', '.').trim();
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function viabilityColor(status: 'green' | 'yellow' | 'red'): string {
  switch (status) {
    case 'green':
      return 'text-signal-green';
    case 'yellow':
      return 'text-signal-yellow';
    case 'red':
      return 'text-signal-red';
  }
}

export function viabilityBg(status: 'green' | 'yellow' | 'red'): string {
  switch (status) {
    case 'green':
      return 'bg-green-50 border-green-200';
    case 'yellow':
      return 'bg-yellow-50 border-yellow-200';
    case 'red':
      return 'bg-red-50 border-red-200';
  }
}

export function viabilityDot(status: 'green' | 'yellow' | 'red'): string {
  switch (status) {
    case 'green':
      return 'bg-signal-green';
    case 'yellow':
      return 'bg-signal-yellow';
    case 'red':
      return 'bg-signal-red';
  }
}
