
import { API_BASE_URL } from '@/config';
import { slugify } from './utils';

export interface ApiUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    title?: string;
    phone?: string;
    location?: string;
}

interface ApiProjectMember {
    user: ApiUser;
    role: 'admin' | 'member';
}

export interface AppCommunication {
    id: number;
    title: string;
    institution: string;
    direction: 'incoming' | 'outgoing';
    code: string;
    communicated_at: string;
    project_id?: number;
    project_short_name?: string;
}

interface ApiCommunication {
    id: number;
    title: string;
    institution: string;
    direction: 'incoming' | 'outgoing';
    code: string;
    communicated_at: string;
    project_id?: number;
    project_short_name?: string;
}

interface ApiProject {
    id: number;
    name: string;
    short_name: string;
    short_name_slug: string;
    members: ApiProjectMember[];
    alter_project_no: string;
    employer: string;
    location: string;
    country: string;
    communications: ApiCommunication[];
    description: string;
}

export interface AppProjectMember {
    id: number;
    name: string;
    role: 'admin' | 'member';
}

export interface AppProject {
    id: string;
    title: string;
    short_name_slug: string;
    members: AppProjectMember[];
    alterProjectNo: string;
    employer: string;
    location: string;
    country: string;
    communications: AppCommunication[];
    description: string;
}

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
        communications: (apiProject.communications || []).map(comm => ({
            id: comm.id,
            title: comm.title,
            institution: comm.institution,
            direction: comm.direction,
            code: comm.code,
            communicated_at: comm.communicated_at,
        })),
        description: apiProject.description,
    };
}

export async function fetchProjects(): Promise<AppProject[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
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

export async function fetchUsers(): Promise<ApiUser[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
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


export async function fetchCommunications(): Promise<AppCommunication[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/communications`);
        if (!response.ok) {
            console.error(`Failed to fetch communications with status: ${response.status}`);
            return [];
        }
        const apiData: { communications: AppCommunication[] } = await response.json();

        if (!apiData || !Array.isArray(apiData.communications)) {
            console.error("Fetched communications data is not in the expected format.");
            return [];
        }
        return apiData.communications;
    } catch (error) {
        console.error("A network or parsing error occurred while fetching communications:", error);
        return [];
    }
}

export async function fetchUnitsData(): Promise<{ units: ApiUnit[] }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/units`);
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
