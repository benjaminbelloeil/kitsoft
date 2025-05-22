/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get all clients from the database
    const { data: clients, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error fetching clients:', error);
      return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error in GET clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate request body
    const { nombre, direccion, telefono, correo, url_logo } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: 'Missing required field: nombre' },
        { status: 400 }
      );
    }

    // Add the client to the database
    const { data, error } = await supabase
      .from('clientes')
      .insert([
        { 
          nombre, 
          direccion, 
          telefono, 
          correo,
          url_logo
        }
      ])
      .select();

    if (error) {
      console.error('Error creating client:', error);
      return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error in POST client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
