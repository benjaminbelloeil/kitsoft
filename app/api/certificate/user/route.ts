import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
	try {
		// Get the userId from query parameters
		const urlQuery = request.nextUrl.searchParams;
		const userId = urlQuery.get('userId');

		// Salir de funcion si se llama con el valor inicial de perfil, "emptyProfile", que viene de ProfilePage()
		if (userId === 'user-id') {
			return NextResponse.json(
				{ error: 'Called api with starter user-id' },
				{ status: 200 }
			);
		}
		// Get authenticated user
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		console.log('Supabase call:', user);

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized access' },
				{ status: 401 }
			);
		}

		console.log('API UserID: ', userId);

		if (!userId) {
			return NextResponse.json(
				{ error: 'User ID is required' },
				{ status: 400 }
			);
		}

		// Security check: normal users can only get their own certificates
		if (userId !== user.id) {
			// TODO: Add admin check here when implementing admin roles
			return NextResponse.json(
				{ error: 'You can only access your own certificates' },
				{ status: 403 }
			);
		}

		// Get the user-certificate relationship for this user
		const { data, error } = await supabase
			.from('usuarios_certificados')
			.select('*, certificados(*)')
			.eq('id_usuario', userId);

		if (error) {
			console.error('Error fetching user certificates:', error);
			return NextResponse.json(
				{ error: 'Failed to fetch user certificates' },
				{ status: 500 }
			);
		}

		return NextResponse.json(data || []);
	}

	catch (error) {
		console.error('Unexpected error in user certificates API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}