
'use server';
import { API_BASE_URL } from '@/config';
import { cookies } from 'next/headers';
import type { ApiUser } from '@/lib/data-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { current_password, password, password_confirmation } = body;

    // Get token and user from cookies
    const token = cookies().get('auth_token')?.value;
    const userCookie = cookies().get('user')?.value;

    if (!token) {
      return Response.json({ message: 'Authentication required. No token found.' }, { status: 401 });
    }

    if (!userCookie) {
      return Response.json({ message: 'Authentication required. No user found.' }, { status: 401 });
    }

    const user: ApiUser = JSON.parse(userCookie);
    const userId = user.id;

    // Call the external API
    const apiRes = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        current_password,
        password,
        password_confirmation,
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
        // Forward the error message from the backend API
        return Response.json({ message: data.message || 'Failed to change password.' }, { status: apiRes.status });
    }

    return Response.json({ success: true, message: 'Password changed successfully.' });

  } catch (error: any) {
    console.error('Change password API route error:', error);
    // Differentiate between JSON parsing error and other errors
    if (error instanceof SyntaxError) {
        return Response.json({ message: 'Invalid user data in cookie.' }, { status: 500 });
    }
    return Response.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
