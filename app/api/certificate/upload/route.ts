import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Disable default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    
    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: users can only upload files for themselves unless they're admin
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only upload certificates for your own profile' },
        { status: 403 }
      );
    }
    
    // Create a safe filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `Certificates/${userId}-${Date.now()}-${safeName}`;
    
    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload the file
    const { data, error: uploadError } = await supabase.storage
      .from('usuarios')
      .upload(path, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading certificate:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Failed to upload certificate' },
        { status: 500 }
      );
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('usuarios')
      .getPublicUrl(data.path);
    
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Unexpected error in upload certificate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}