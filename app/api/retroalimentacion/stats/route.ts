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

		// Get all feedback for the user
		const { data: feedbackData, error: feedbackError } = await supabase
			.from('retroalimentaciones')
			.select('id_retroalimentacion, valoracion, fecha')
			.eq('id_usuario', userId);

		if (feedbackError || !feedbackData) {
			console.error('Error fetching feedback stats:', feedbackError);
			return NextResponse.json(
				{ error: 'Error fetching feedback stats' },
				{ status: 500 }
			);
		}

		// Calculate stats by category
		const categoryStats: { [key: string]: { total: number; count: number; ratings: number[] } } = {};
		
		// For each feedback, get its categories
		for (const feedback of feedbackData) {
			const { data: categoriesData } = await supabase
				.from('retro_categoria')
				.select(`
					categoria (
						nombre
					)
				`)
				.eq('id_retroalimentacion', feedback.id_retroalimentacion);
			
			const categories = categoriesData?.map((cat: any) => cat.categoria?.nombre).filter(Boolean) || ['General'];
			
			categories.forEach((category: string) => {
				if (!categoryStats[category]) {
					categoryStats[category] = { total: 0, count: 0, ratings: [] };
				}
				categoryStats[category].total += feedback.valoracion;
				categoryStats[category].count += 1;
				categoryStats[category].ratings.push(feedback.valoracion);
			});
		}

		// Convert to stats format with trend calculation
		const stats: Array<{
			title: string;
			value: string;
			trend: string;
			color: string;
		}> = [];
		const colors = ['blue', 'indigo', 'cyan', 'emerald'];
		
		Object.entries(categoryStats).forEach(([category, data], index) => {
			const average = data.count > 0 ? (data.total / data.count) : 0;
			
			// Simple trend calculation - compare recent vs older feedback
			const recentRatings = data.ratings.slice(0, Math.ceil(data.ratings.length / 2));
			const olderRatings = data.ratings.slice(Math.ceil(data.ratings.length / 2));
			
			let trend = "0.0";
			if (recentRatings.length > 0 && olderRatings.length > 0) {
				const recentAvg = recentRatings.reduce((sum, rating) => sum + rating, 0) / recentRatings.length;
				const olderAvg = olderRatings.reduce((sum, rating) => sum + rating, 0) / olderRatings.length;
				const difference = recentAvg - olderAvg;
				trend = difference > 0 ? `+${difference.toFixed(1)}` : difference.toFixed(1);
			}

			stats.push({
				title: category,
				value: average.toFixed(1),
				trend,
				color: colors[index % colors.length]
			});
		});

		return NextResponse.json({ data: stats });
	} catch (error) {
		console.error('Error in feedback stats API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
