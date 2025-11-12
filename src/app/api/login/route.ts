
'use server';
import { API_BASE_URL } from '@/config';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const apiRes = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return Response.json({ message: data.message || 'Authentication failed' }, { status: apiRes.status });
    }

    if (data.access_token) {
      const cookieOptions = {
        httpOnly: false, // Make it accessible by server-side fetch
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      };

      // Set auth token cookie
      cookies().set('auth_token', data.access_token, cookieOptions);
      
      // Set user info cookie
      if (data.user) {
        cookies().set('user', JSON.stringify(data.user), cookieOptions);
      }

      // Return the user object along with success
      return Response.json({ success: true, user: data.user });
    } else {
      return Response.json({ message: 'Login failed, no token received' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API route error:', error);
    return Response.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
