import { API_BASE_URL } from '@/config';
import { slugify } from './utils';
import { cookies } from 'next/headers';


// API'den gelen orijinal kullanıcı verisi yapısı
export interface ApiUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    title?: string;
    phone?: string;
    location?: string;
}

// API'den gelen orijinal proje üyesi verisi yapısı
interface ApiProjectMember {
    user: ApiUser;
    role: 'admin' | 'member';
}

// API'den gelen orijinal proje verisi yapısı
interface ApiProject {
    id: number;
    name: string;
    short_name: string;
    short_name_slug: string;
    alter_project_no: string;
    employer: string;
    location: string;
    country: string;
    description: string;
    members: ApiProjectMember[];
}

// API'den gelen orijinal yazışma verisi yapısı
export interface ApiCommunication {
    id: number;
    title: string;
    institution: string;
    direction: 'incoming' | 'outgoing';
    code: string;
    communicated_at: string;
    project_id?: number;
    project_short_name?: string;
}


// API'den gelen orijinal birim verisi yapısı
export interface ApiUnit {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    users: ApiUser[];
}


// Uygulama içinde kullanılacak proje üyesi modeli
export interface AppProjectMember {
    id: number;
    name: string;
    role: 'admin' | 'member';
}

// Uygulama içinde kullanılacak proje modeli
export interface AppProject {
    id: string;
    title: string;
    short_name_slug: string;
    alterProjectNo: string;
    employer: string;
    location: string;
    country: string;
    description: string;
    members: AppProjectMember[];
    communications: AppCommunication[];
}

// Uygulama içinde kullanılacak yazışma modeli
export interface AppCommunication extends ApiCommunication {}


// API'den gelen proje verisini uygulama modeline dönüştüren fonksiyon
function mapApiProjectToAppProject(apiProject: ApiProject): AppProject {
    const projectMembers = (apiProject.members || []).map(member => ({
        id: member.user.id,
        name: `${member.user.first_name} ${member.user.last_name}`,
        role: member.role,
    }));

    return {
        id: apiProject.id.toString(),
        title: apiProject.name,
        short_name_slug: apiProject.short_name_slug,
        members: projectMembers,
        alterProjectNo: apiProject.alter_project_no,
        employer: apiProject.employer,
        location: apiProject.location,
        country: apiProject.country,
        description: apiProject.description,
        communications: [], // Bu alan sonradan birleştirilecek
    };
}


/**
 * /api/projects endpoint'inden tüm projeleri çeker.
 */
export async function fetchProjects(): Promise<AppProject[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        const headers: HeadersInit = { 'Accept': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/projects`, { headers });
        if (!response.ok) {
            console.error(`Failed to fetch projects with status: ${response.status}`);
            return [];
        }
        const apiData: { projects: ApiProject[] } = await response.json();
        if (!apiData || !Array.isArray(apiData.projects)) {
            console.error("Fetched project data is not in the expected format.");
            return [];
        }
        return apiData.projects.map(mapApiProjectToAppProject);
    } catch (error) {
        console.error("A network or parsing error occurred while fetching projects:", error);
        return [];
    }
}

/**
 * /api/users endpoint'inden tüm kullanıcıları çeker.
 */
export async function fetchUsers(): Promise<ApiUser[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        const headers: HeadersInit = { 'Accept': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/users`, { headers });
        if (!response.ok) {
            console.error(`Failed to fetch users with status: ${response.status}`);
            return [];
        }
        const apiData: { users: ApiUser[] } = await response.json();
        if (!apiData || !Array.isArray(apiData.users)) {
            console.error("Fetched user data is not in the expected format.");
            return [];
        }
        return apiData.users;
    } catch (error) {
        console.error("A network or parsing error occurred while fetching users:", error);
        return [];
    }
}

/**
 * /api/units endpoint'inden tüm birimleri çeker.
 */
export async function fetchUnitsData(): Promise<{ units: ApiUnit[] }> {
    try {
        const token = cookies().get('auth_token')?.value;
        const headers: HeadersInit = { 'Accept': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/units`, { headers });
        if (!response.ok) {
            console.error(`Failed to fetch units data with status: ${response.status}`);
            return { units: [] };
        }
        const apiData: { units: ApiUnit[] } = await response.json();
        return {
            units: apiData.units || []
        };
    } catch (error) {
        console.error("A network or parsing error occurred while fetching units data:", error);
        return { units: [] };
    }
}

/**
 * /api/communications endpoint'inden tüm yazışmaları çeker.
 */
export async function fetchCommunications(): Promise<AppCommunication[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        const headers: HeadersInit = { 'Accept': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/communications`, { headers });
        if (!response.ok) {
            console.error(`Failed to fetch communications with status: ${response.status}`);
            return [];
        }
        const apiData: { communications: AppCommunication[] } = await response.json();
        if (!apiData || !Array.isArray(apiData.communications)) {
            console.error("Fetched communication data is not in the expected format.");
            return [];
        }
        return apiData.communications;
    } catch (error) {
        console.error("A network or parsing error occurred while fetching communications:", error);
        return [];
    }
}

/**
 * /api/communications/{id} endpoint'inden tek bir yazışmayı çeker.
 */
export async function fetchCommunicationById(id: string): Promise<AppCommunication | null> {
    try {
        const token = cookies().get('auth_token')?.value;
        const headers: HeadersInit = { 'Accept': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/communications/${id}`, { headers });
        if (!response.ok) {
            console.error(`Failed to fetch communication with id ${id}, status: ${response.status}`);
            if (response.status === 404) return null;
            return null;
        }
        const apiData: { communication: AppCommunication } = await response.json();
        if (!apiData || !apiData.communication) {
            console.error("Fetched single communication data is not in the expected format.");
            return null;
        }
        return apiData.communication;
    } catch (error) {
        console.error(`A network or parsing error occurred while fetching communication ${id}:`, error);
        return null;
    }
}
