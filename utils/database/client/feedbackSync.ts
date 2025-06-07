/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/client";

// Enhanced feedback type to match frontend expectations
export interface EnhancedFeedbackItem {
	id: string;
	from: {
		id: string;
		name: string;
		avatar: string;
		role: string;
	};
	date: string;
	rating: number;
	category: string;
	message: string;
	project?: string;
}

export interface FeedbackStats {
	title: string;
	value: string;
	trend: string;
	color: string;
}

export type FeedbackDataType = {
	mensaje: string,
	valoracion: number,
	id_usuario: string,
	id_autor: string,
	id_proyecto: string,
	categorias: string[]
}

// Original function - keeping for backward compatibility
export async function getUserFeedback(userId: string) {
	const supabase = createClient()
	const {data, error} = await supabase.from('retroalimentaciones').select().eq('id_usuario', userId);
	
	if (error) throw new Error('Error fetching feedback');

	return data;
}

// Enhanced function to get feedback with all related data
export async function getUserFeedbackEnhanced(userId: string): Promise<EnhancedFeedbackItem[]> {
	try {
		const response = await fetch(`/api/retroalimentacion/enhanced?userId=${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Error fetching enhanced feedback:', errorData.error);
			return [];
		}

		const result = await response.json();
		return result.data || [];
	} catch (error) {
		console.error('Error in getUserFeedbackEnhanced:', error);
		return [];
	}
}

// Function to calculate feedback statistics
export async function getFeedbackStats(userId: string): Promise<FeedbackStats[]> {
	try {
		const response = await fetch(`/api/retroalimentacion/stats?userId=${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Error fetching feedback stats:', errorData.error);
			return [];
		}

		const result = await response.json();
		return result.data || [];
	} catch (error) {
		console.error('Error in getFeedbackStats:', error);
		return [];
	}
}

export async function addUserFeedback(feedbackData: FeedbackDataType): Promise<any[]> {
	const supabase = createClient();
	
	// Adding single feedback to table
	const {data, error} = await supabase
		.from('retroalimentaciones')
		.insert({
			mensaje: feedbackData.mensaje,
			valoracion: feedbackData.valoracion,
			id_usuario: feedbackData.id_usuario,
			id_autor: feedbackData.id_autor,
			id_proyecto: feedbackData.id_proyecto,
		})
		.select();

	if (error) {
		console.error('Error adding feedback to database:', error);
		throw new Error('Error adding feedback to database:');
	}

	// Adding to retro_categoria table
	feedbackData.categorias.forEach(async (category) => {
		const categoryId = await supabase
			.from('categoria')
			.select()
			.eq('nombre', category);

		console.log("FOR DEBUGGING:", categoryId.data);

		const secondRequest = await supabase
			.from('retro_categoria')
			.insert({
				id_retroalimentacion: data[0].id_retroalimentacion,
				id_categoria: categoryId.data![0].id_categoria
			});

		if (secondRequest.error) {
			console.error('Error adding to retro_categoria table:', secondRequest.error);
			throw new Error('Error adding to retro_categoria table');
		}
	});

	return data;
}