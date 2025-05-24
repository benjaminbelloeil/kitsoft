import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
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
		const { certificateId, userId } = await request.json();

		if (!certificateId || !userId) {
			return NextResponse.json(
				{ error: 'Missing required parameters' },
				{ status: 400 }
			);
		}

		// Security check: users can only delete their own certificates
		if (userId !== user.id) {
			// TODO: Add admin check here when implementing admin roles
			return NextResponse.json(
				{ error: 'You can only delete certificates from your own profile' },
				{ status: 403 }
			);
		}


		// First verify that this certificate belongs to the user
		const { data: certData, error: certError } = await supabase
			.from('usuarios_certificados')
			.delete()
			.eq('id_certificado', certificateId)
			.eq('id_usuario', userId)

		console.log('DELETE Result: ', certData);
		if (certError || !certData) {
			console.error('Error deleting certificate:', certError);
			return NextResponse.json(
				{ error: 'Certificate not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Unexpected error in delete certificate API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}