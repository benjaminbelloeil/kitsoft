import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { usuario_certificado } from '@/interfaces';

export async function POST(request: NextRequest) {
	try {
		// Get authenticated user
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized access' },
				{ status: 401 }
			);
		}

		// Get the request body
		const certificateData: usuario_certificado = await request.json();
		console.log('ADD request data: ', certificateData);

		if (!certificateData.id_usuario || !certificateData || !certificateData.id_certificado || !certificateData.fecha_inicio) {
			return NextResponse.json(
				{ error: 'Missing required certificate data' },
				{ status: 400 }
			);
		}

		// Security check: users can only add certificates for themselves
		if (certificateData.id_usuario !== user.id) {
			// TODO: Add admin check here when implementing admin roles
			return NextResponse.json(
				{ error: 'You can only add certificates to your own profile' },
				{ status: 403 }
			);
		}

		// Generate a UUID for the certificate
		const id = crypto.randomUUID();

		// Insert the certificate
		const { data, error } = await supabase
			.from('usuarios_certificados')
			.insert({
				id_certificado: certificateData.id_certificado,
				id_usuario: certificateData.id_usuario,
				fecha_inicio: certificateData.fecha_inicio,
				fecha_fin: null,
				// TODO: Replace 'null' with url to File
				url_archivo: null 
			})
			.select();

		if (error) {
			console.error('Error adding certificate:', error);
			return NextResponse.json(
				{ error: 'Failed to add certificate' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			id: data && data[0] ? data[0].id_certificado_usuario : id
		});
	} catch (error) {
		console.error('Unexpected error in add certificate API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}