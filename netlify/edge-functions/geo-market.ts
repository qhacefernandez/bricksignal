type GeoContext = {
  geo?: { country?: { code?: string } };
};

export default async (_request: Request, context: GeoContext) => {
  const country = context.geo?.country?.code ?? null;
  return new Response(JSON.stringify({ country }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};
