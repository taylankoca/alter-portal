
import { placeholderImages as imagePlaceholders } from '@/lib/placeholder-images.json';

interface ApiUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface ApiProjectMember {
    user: ApiUser;
}

interface ApiProject {
    id: number;
    name: string;
    short_name: string;
    members: ApiProjectMember[];
}

interface AppProject {
    id: string;
    title: string;
    description: string;
    members: string[];
}

const imageKeys = Object.keys(imagePlaceholders);

function mapApiProjectToAppProject(apiProject: ApiProject, index: number): AppProject {
    const memberNames = apiProject.members.map(member => `${member.user.first_name} ${member.user.last_name}`);

    return {
        id: apiProject.id.toString(),
        title: apiProject.short_name,
        description: apiProject.name,
        members: memberNames,
    };
}

export async function fetchData(): Promise<{ projects: AppProject[]; users: ApiUser[] }> {
    try {
        const response = await fetch('https://portal.alter.com.tr/api/data');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const apiData: { projects: ApiProject[]; users: ApiUser[] } = await response.json();

        const mappedProjects = apiData.projects.map(mapApiProjectToAppProject);

        return {
            projects: mappedProjects,
            users: apiData.users
        };
    } catch (error) {
        console.error("Error fetching or mapping data:", error);
        return { projects: [], users: [] };
    }
}
