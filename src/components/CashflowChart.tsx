'use client';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatEuro } from '@/lib/format';
import type { AnnualCashflowRow } from '@/lib/types';

interface CashflowChartProps {
  data: AnnualCashflowRow[];
  years?: number;
}

export default function CashflowChart({ data, years = 10 }: CashflowChartProps) {
  const chartData = data.slice(0, years).map((row) => ({
    year: `Año ${row.year}`,
    cashflow: Math.round(row.cashflowAfterTax),
    noi: Math.round(row.noi),
    equity: Math.round(row.equity),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
          <Tooltip formatter={(value: number) => formatEuro(value)} />
          <Legend />
          <Bar dataKey="cashflow" name="Cashflow post-imp." fill="#0c8ce9" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="equity" name="Patrimonio neto" stroke="#16a34a" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
