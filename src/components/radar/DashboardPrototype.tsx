import type { ReactNode } from 'react';
import { ENABLE_SUPABASE_AUTH } from '@/lib/flags';

interface DashboardPrototypeProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const NAV = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/dashboard/searches', label: 'Búsquedas' },
  { href: '/dashboard/opportunities', label: 'Oportunidades' },
  { href: '/dashboard/billing', label: 'Facturación' },
];

export default function DashboardPrototype({ title, description, children }: DashboardPrototypeProps) {
  return (
    <div className="space-y-6">
      {!ENABLE_SUPABASE_AUTH && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Prototipo visual.</strong> TODO: conectar Supabase Auth y base de datos para acceso real.
          Actualmente no hay login ni persistencia de suscripciones en servidor.
        </div>
      )}

      <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-700"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-slate-600">{description}</p>
      </div>

      {children ?? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          Contenido pendiente de implementación con Supabase + Stripe webhooks.
        </div>
      )}
    </div>
  );
}
