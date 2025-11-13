
'use server';

import { API_BASE_URL } from '@/config';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formCode, ...formData } = body;

    if (!formCode) {
      return Response.json({ message: 'Form code is required' }, { status: 400 });
    }

    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return Response.json({ message: 'Authentication required' }, { status: 401 });
    }

    const apiRes = await fetch(`${API_BASE_URL}/api/forms/${formCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return Response.json({ message: data.message || 'Form submission failed' }, { status: apiRes.status });
    }

    return Response.json(data, { status: 201 });

  } catch (error) {
    console.error('Form submission API route error:', error);
    return Response.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
