
'use server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Remove the authentication cookie
    cookies().set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0), // Set expiry date to the past to delete it
    });
    
    return Response.json({ success: true, message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout API route error:', error);
    return Response.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
