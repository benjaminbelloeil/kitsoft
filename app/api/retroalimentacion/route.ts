/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		
		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized access' },
				{ status: 401 }
			);
		}
		
		const reqData: {
			mensaje: string,
			valoracion: number,
			id_usuario: string,
			id_autor: string,
			id_proyecto: string,
			categorias: string[]
		} = await request.json();

		if (!reqData.mensaje || !reqData.valoracion || !reqData.id_usuario || !reqData.id_proyecto || !reqData.id_autor) {
			console.log('Data badly formatted.');
			return NextResponse.json(
				{ error: 'Missing required feedback data' },
				{ status: 400 }
			);
		}

		// Adding single feedback to table
		const {data, error} = await supabase
			.from('retroalimentaciones')
			.insert({
				mensaje: reqData.mensaje,
				valoracion: reqData.valoracion,
				id_usuario: reqData.id_usuario,
				id_autor: reqData.id_autor,
				id_proyecto: reqData.id_proyecto,
			})
			.select();

		if (error) {
			console.error('Error adding feedback to database:', error);
			return NextResponse.json(
				{ error: 'Failed to add feedback' },
				{ status: 500 }
			);
		}

		// Adding to retro_categoria table

		reqData.categorias.forEach(async (category) => {
			const categoryId = await supabase
				.from('categoria')
				.select()
				.eq('nombre', category)

			console.log("FOR DEBUGGING:", categoryId.data);

			await supabase
			.from('retro_categoria')
			.insert({
				id_retroalimentacion: data[0].id_retroalimentacion,
				id_categoria: categoryId.data![0].id_categoria
			})
		});

		return NextResponse.json({
			success: true,
			id: data && data[0] ? data[0].id_retroalimentacion : 'NO ID'
		});
	} 
	catch (error: any) {
		console.error('Unexpected error in add certificate API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}

}