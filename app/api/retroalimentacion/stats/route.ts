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
		const categoryStats: { [key: string]: { total: number; count: number; feedbackEntries: Array<{ rating: number; date: string }> } } = {};
		
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
					categoryStats[category] = { total: 0, count: 0, feedbackEntries: [] };
				}
				categoryStats[category].total += feedback.valoracion;
				categoryStats[category].count += 1;
				categoryStats[category].feedbackEntries.push({
					rating: feedback.valoracion,
					date: feedback.fecha
				});
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
			
			// Calculate trend based on average progression over time
			let trend = "0.0";
			if (data.feedbackEntries.length >= 2) {
				// Sort feedback by date (most recent first), then by creation order
				const sortedFeedback = data.feedbackEntries.sort((a, b) => 
					new Date(b.date).getTime() - new Date(a.date).getTime()
				);
								
				// Check if all feedback is from the same date
				const uniqueDates = [...new Set(sortedFeedback.map(f => f.date))];
				
				if (uniqueDates.length === 1) {
					// All feedback from same date - need to determine chronological order
					// Since we can't rely on timestamps, we'll assume lower ratings came first
					const ratings = sortedFeedback.map(f => f.rating).sort((a, b) => a - b); // Sort ascending: [4, 5]
					
					if (ratings.length === 2) {
						// Calculate the trend as: new average - old value
						// After first rating: average = 4.0
						// After second rating: average = (4+5)/2 = 4.5
						// Trend = 4.5 - 4.0 = +0.5
						const firstRating = ratings[0]; // 4
						const newAverage = ratings.reduce((sum, r) => sum + r, 0) / ratings.length; // 4.5
						const difference = newAverage - firstRating; // 4.5 - 4.0 = 0.5
						trend = difference > 0 ? `+${difference.toFixed(1)}` : difference.toFixed(1);
					} else {
						// For more ratings: compare recent half vs older half averages
						const midPoint = Math.ceil(ratings.length / 2);
						const olderRatings = ratings.slice(0, midPoint);
						const recentRatings = ratings.slice(midPoint);
						
						const olderAvg = olderRatings.reduce((sum, r) => sum + r, 0) / olderRatings.length;
						const recentAvg = recentRatings.reduce((sum, r) => sum + r, 0) / recentRatings.length;
						const difference = recentAvg - olderAvg;
						trend = difference > 0 ? `+${difference.toFixed(1)}` : difference.toFixed(1);
					}
				} else {
					// Different dates - compare most recent vs average of previous
					const mostRecent = sortedFeedback[0].rating;
					const previousFeedback = sortedFeedback.slice(1);
					const previousAvg = previousFeedback.reduce((sum, entry) => sum + entry.rating, 0) / previousFeedback.length;
					const difference = mostRecent - previousAvg;
					trend = difference > 0 ? `+${difference.toFixed(1)}` : difference.toFixed(1);
				}
				
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
