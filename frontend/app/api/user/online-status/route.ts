import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Por ahora, devolver false ya que necesitamos comunicación con el backend Socket.io
    // Esto se puede mejorar haciendo una llamada HTTP al backend o usando Redis
    const isOnline = false;
    
    return NextResponse.json({ isOnline });
  } catch (error) {
    console.error('Error checking online status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
