/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get all projects from the database
    const { data: projects, error } = await supabase
      .from('proyectos')
      .select('*')
      .order('fecha_inicio', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate request body
    const { titulo, descripcion, id_cliente, id_projectlead, fecha_inicio, fecha_fin, horas_totales } = body;

    if (!titulo || !id_cliente || !id_projectlead || !fecha_inicio || !horas_totales) {
      return NextResponse.json(
        { error: 'Missing required fields: titulo, id_cliente, id_projectlead, fecha_inicio, horas_totales' },
        { status: 400 }
      );
    }

    // Add the project to the database with activo = true by default
    const { data, error } = await supabase
      .from('proyectos')
      .insert([
        { 
          titulo, 
          descripcion, 
          id_cliente, 
          id_projectlead,
          fecha_inicio, 
          fecha_fin, 
          horas_totales,
          activo: true 
        }
      ])
      .select();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error in POST project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
