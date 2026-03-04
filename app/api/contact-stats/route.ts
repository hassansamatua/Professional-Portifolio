import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get pending count
    const { count: pendingCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get replied count
    const { count: repliedCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'replied');

    // Get total count
    const { count: totalCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      pending: pendingCount || 0,
      replied: repliedCount || 0,
      total: totalCount || 0
    });

  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
