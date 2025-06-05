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
			id_proyecto: string
		} = await request.json();

		if (!reqData.mensaje || !reqData.valoracion || !reqData.id_usuario || !reqData.id_proyecto || !reqData.id_autor) {
			console.log('Data badly formatted.');
			return NextResponse.json(
				{ error: 'Missing required feedback data' },
				{ status: 400 }
			);
		}

		const {data, error} = await supabase
			.from('retroalimentaciones')
			.insert(reqData)
			.select();

		if (error) {
			console.error('Error adding feedback to database:', error);
			return NextResponse.json(
				{ error: 'Failed to add feedback' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			id: data && data[0] ? data[0].id_retroalimentacion : 'NO ID'
		});
	} 
	catch (error) {
		console.error('Unexpected error in add certificate API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}

}