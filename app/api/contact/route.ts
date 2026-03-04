import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { emailQueue } from '@/lib/email-queue';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const { success } = await rateLimit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const captchaToken = formData.get('captchaToken') as string;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Simple captcha validation
    if (captchaToken !== '10') {
      return NextResponse.json(
        { error: 'Invalid captcha response' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Handle file attachments
    const attachments: string[] = [];
    let totalSize = 0;
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    for (let i = 0; i < maxFiles; i++) {
      const file = formData.get(`attachment_${i}`) as File;
      if (file && file.size > 0) {
        totalSize += file.size;
        if (totalSize > maxFileSize * maxFiles) {
          return NextResponse.json(
            { error: 'Total file size exceeds limit' },
            { status: 400 }
          );
        }

        // Here you would typically upload files to a storage service
        // For now, we'll just store the file metadata
        attachments.push({
          name: file.name,
          size: file.size,
          type: file.type
        } as any);
      }
    }

    // Create Supabase client
    const supabase = await createClient();

    // Insert contact message into database
    const { data: contactMessage, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message,
        attachments,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Queue emails instead of sending immediately
    try {
      // Queue user confirmation email (normal priority)
      emailQueue.add({
        type: 'user_confirmation',
        to: email,
        subject: `Thank you for contacting Hansco Dev - Re: ${subject}`,
        data: { name, subject },
        priority: 'normal'
      });

      // Queue admin notification (high priority)
      emailQueue.add({
        type: 'admin_notification',
        to: process.env.ADMIN_EMAIL || 'hanscodev@gmail.com',
        subject: `📬 New Contact Message: ${subject}`,
        data: contactMessage,
        priority: 'high'
      });

      // Process email queue
      await emailQueue.process();
    } catch (emailError) {
      console.error('Email queue error:', emailError);
      // Continue even if email fails
    }

    // Real-time updates are now handled by polling in the frontend
    // No WebSocket needed - admin panel polls every 10 seconds
    console.log('New contact message received:', { name, subject, id: contactMessage.id });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully',
        id: contactMessage.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get messages with pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: messages, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
