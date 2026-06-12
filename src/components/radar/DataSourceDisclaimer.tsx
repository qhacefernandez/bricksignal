export default function DataSourceDisclaimer({ demo = false }: { demo?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
      {demo && (
        <p className="mb-2 font-medium text-slate-800">
          Datos de ejemplo. Radar Pro solo usará fuentes autorizadas, datos introducidos por el usuario o
          integraciones con permiso.
        </p>
      )}
      <p>
        Los resultados son orientativos y dependen de hipótesis editables. No constituyen asesoramiento
        financiero, fiscal, legal ni recomendación de compra.
      </p>
    </div>
  );
}
