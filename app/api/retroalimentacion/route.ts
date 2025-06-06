/* eslint-disable @typescript-eslint/no-explicit-any */
import { addUserFeedback, FeedbackDataType } from "@/utils/database/client/feedbackSync";
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
		
		const reqData: FeedbackDataType = await request.json();

		if (!reqData.mensaje || !reqData.valoracion || !reqData.id_usuario || !reqData.id_proyecto || !reqData.id_autor) {
			console.log('Data badly formatted.');
			return NextResponse.json(
				{ error: 'Missing required feedback data' },
				{ status: 400 }
			);
		}

		const data = await addUserFeedback(reqData);

		return NextResponse.json({
			success: true,
			id: data && data[0] ? data[0].id_retroalimentacion : 'NO ID'
		});
	} 
	catch (error: any) {
		console.error('Unexpected error in add certificate API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}

}