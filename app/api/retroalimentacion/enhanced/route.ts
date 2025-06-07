/* eslint-disable @typescript-eslint/no-explicit-any */
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

		// Get userId from query params
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');

		if (!userId) {
			return NextResponse.json(
				{ error: 'userId parameter is required' },
				{ status: 400 }
			);
		}

		// Step 1: Get basic feedback data
		const { data: feedbackData, error: feedbackError } = await supabase
			.from('retroalimentaciones')
			.select('*')
			.eq('id_usuario', userId)
			.order('fecha', { ascending: false });

		if (feedbackError) {
			console.error('Error fetching feedback:', feedbackError);
			return NextResponse.json(
				{ error: 'Error fetching feedback' },
				{ status: 500 }
			);
		}

		if (!feedbackData || feedbackData.length === 0) {
			return NextResponse.json({ data: [] });
		}

		const enhancedFeedback = [];

		// Step 2: Process each feedback item
		for (const feedback of feedbackData) {
			// Get author information
			const { data: authorData } = await supabase
				.from('usuarios')
				.select('id_usuario, nombre, apellido, titulo, url_avatar')
				.eq('id_usuario', feedback.id_autor)
				.single();

			// Get project information
			const { data: projectData } = await supabase
				.from('proyectos')
				.select('id_proyecto, titulo')
				.eq('id_proyecto', feedback.id_proyecto)
				.single();

			// Get categories for this feedback
			const { data: categoriesData } = await supabase
				.from('retro_categoria')
				.select(`
					categoria (
						nombre
					)
				`)
				.eq('id_retroalimentacion', feedback.id_retroalimentacion);

			// Extract category names
			const categories = categoriesData?.map((cat: any) => cat.categoria?.nombre).filter(Boolean) || [];
			const primaryCategory = categories[0] || 'General';

			// Build enhanced feedback item
			enhancedFeedback.push({
				id: feedback.id_retroalimentacion.toString(),
				from: {
					id: authorData?.id_usuario || '',
					name: `${authorData?.nombre || ''} ${authorData?.apellido || ''}`.trim() || 'Usuario Anónimo',
					avatar: authorData?.url_avatar || '/avatars/default-avatar.png',
					role: authorData?.titulo || 'Sin título'
				},
				date: feedback.fecha,
				rating: feedback.valoracion,
				category: primaryCategory,
				message: feedback.mensaje,
				project: projectData?.titulo || undefined
			});
		}

		return NextResponse.json({ data: enhancedFeedback });
	} catch (error) {
		console.error('Error in enhanced feedback API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
