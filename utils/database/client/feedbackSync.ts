/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/client";

export async function getUserFeedback(userId: string) {
	const supabase = createClient()
	const {data, error} = await supabase.from('retroalimentaciones').select().eq('id_usuario', userId);
	
	if (error) throw new Error('Error fetching feedback');

	return data;
}

export type FeedbackDataType = {
	mensaje: string,
	valoracion: number,
	id_usuario: string,
	id_autor: string,
	id_proyecto: string,
	categorias: string[]
}

export async function addUserFeedback(feedbackData: FeedbackDataType): Promise<any[]> {
	const supabase = createClient()
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
				.eq('nombre', category)

			console.log("FOR DEBUGGING:", categoryId.data);

			const secondRequest = await supabase
			.from('retro_categoria')
			.insert({
				id_retroalimentacion: data[0].id_retroalimentacion,
				id_categoria: categoryId.data![0].id_categoria
			})

			if (secondRequest.error) {
				if (error) {
					console.error('Error adding to retro_categoria table:', error);
					throw new Error('Error adding to retro_categoria table');
				}
			}
		});

		return data;
}