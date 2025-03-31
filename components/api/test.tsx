import { supabase } from '@/app/lib/supabaseClient';

export default async function Test() {
  const { data: paises, error } = await supabase.from('pais').select('*');

  if (error) {
    console.error('Error fetching data:', error.message);
    return <div>Error loading países</div>;
  }

  return (
    <div>
      <h1>Países</h1>
      <ul>
        {paises.map((pais) => (
          <li key={pais.id_pais}>{pais.nombre}</li>
        ))}
      </ul>
    </div>
  );
}