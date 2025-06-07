/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeedbackDataType } from "@/utils/database/client/feedbackSync";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		
		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized access' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');

		if (!userId) {
			return NextResponse.json(
				{ error: 'Missing userId parameter' },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from('retroalimentaciones')
			.select('*')
			.eq('id_usuario', userId);
		
		if (error) {
			console.error('Error fetching feedback:', error);
			return NextResponse.json(
				{ error: 'Error fetching feedback' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			data: data || []
		});
	} catch (error: any) {
		console.error('Unexpected error in get feedback API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

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
		
		const reqData: FeedbackDataType = await request.json();

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
				{ error: 'Error adding feedback to database' },
				{ status: 500 }
			);
		}

		// Adding to retro_categoria table
		if (reqData.categorias && reqData.categorias.length > 0) {
			for (const category of reqData.categorias) {
				const { data: categoryData, error: categoryError } = await supabase
					.from('categoria')
					.select('id_categoria')
					.eq('nombre', category)
					.single();

				if (categoryError) {
					console.error('Error finding category:', categoryError);
					continue; // Skip this category if not found
				}

				const { error: retroCategoryError } = await supabase
					.from('retro_categoria')
					.insert({
						id_retroalimentacion: data[0].id_retroalimentacion,
						id_categoria: categoryData.id_categoria
					});

				if (retroCategoryError) {
					console.error('Error adding to retro_categoria table:', retroCategoryError);
					// Don't return error here, just log it
				}
			}
		}

		return NextResponse.json({
			success: true,
			id: data && data[0] ? data[0].id_retroalimentacion : 'NO ID',
			data: data
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