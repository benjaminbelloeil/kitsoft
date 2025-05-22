/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Get the project by ID
    const { data: project, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id_proyecto', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in GET project by ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = await createClient();
    const body = await request.json();

    // Extract update fields
    const { titulo, descripcion, id_cliente, fecha_inicio, fecha_fin, horas_totales, activo } = body;

    // Create update object with only the fields that were provided
    const updateData: any = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (id_cliente !== undefined) updateData.id_cliente = id_cliente;
    if (fecha_inicio !== undefined) updateData.fecha_inicio = fecha_inicio;
    if (fecha_fin !== undefined) updateData.fecha_fin = fecha_fin;
    if (horas_totales !== undefined) updateData.horas_totales = horas_totales;
    if (activo !== undefined) updateData.activo = activo;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
    }

    // Update the project
    const { data, error } = await supabase
      .from('proyectos')
      .update(updateData)
      .eq('id_proyecto', id)
      .select();

    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error in PATCH project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Instead of actually deleting, we mark the project as inactive
    const { data, error } = await supabase
      .from('proyectos')
      .update({ activo: false })
      .eq('id_proyecto', id)
      .select();

    if (error) {
      console.error('Error archiving project:', error);
      return NextResponse.json({ error: 'Failed to archive project' }, { status: 500 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project archived successfully' });
  } catch (error) {
    console.error('Error in DELETE project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
