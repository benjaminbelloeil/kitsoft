/* eslint-disable @typescript-eslint/no-explicit-any */

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

// Original function - now using API endpoint
export async function getUserFeedback(userId: string) {
	try {
		const response = await fetch(`/api/retroalimentacion?userId=${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Error fetching feedback');
		}

		const result = await response.json();
		return result.data || [];
	} catch (error) {
		console.error('Error in getUserFeedback:', error);
		throw new Error('Error fetching feedback');
	}
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
	try {
		const response = await fetch('/api/retroalimentacion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(feedbackData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Error adding feedback');
		}

		const result = await response.json();
		return result.data || [];
	} catch (error) {
		console.error('Error in addUserFeedback:', error);
		throw new Error('Error adding feedback to database');
	}
}