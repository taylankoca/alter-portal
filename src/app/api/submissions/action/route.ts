
'use server';

import { API_BASE_URL } from '@/config';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submissionId, action, note } = body;

    if (!submissionId || !action) {
      return Response.json({ message: 'Submission ID and action are required' }, { status: 400 });
    }

    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return Response.json({ message: 'Authentication required' }, { status: 401 });
    }

    const apiRes = await fetch(`${API_BASE_URL}/api/forms/submissions/${submissionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ action, note }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return Response.json({ message: data.message || 'Failed to perform action on submission' }, { status: apiRes.status });
    }

    return Response.json(data);

  } catch (error) {
    console.error('Submission action API route error:', error);
    return Response.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
