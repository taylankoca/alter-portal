import { placeholderImages } from '@/lib/placeholder-images.json';

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
    image: {
        src: string;
        width: number;
        height: number;
        "data-ai-hint": string;
    };
}

const imageKeys = Object.keys(placeholderImages);

function mapApiProjectToAppProject(apiProject: ApiProject, index: number): AppProject {
    const imageKey = imageKeys[index % imageKeys.length] as keyof typeof placeholderImages;
    const memberNames = apiProject.members.map(member => `${member.user.first_name} ${member.user.last_name}`);

    return {
        id: apiProject.id.toString(),
        title: apiProject.name,
        description: apiProject.short_name, // Using short_name for description as per original structure
        members: memberNames,
        image: placeholderImages[imageKey],
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
