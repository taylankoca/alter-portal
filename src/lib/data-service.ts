
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
}

export interface AppProjectMember {
    name: string;
    role: 'admin' | 'member';
}

export interface AppProject {
    id: string;
    title: string;
    description: string;
    short_name_slug: string;
    members: AppProjectMember[];
    alterProjectNo: string;
    employer: string;
    location: string;
    country: string;
}

function mapApiProjectToAppProject(apiProject: ApiProject): AppProject {
    const projectMembers = apiProject.members.map(member => ({
        name: `${member.user.first_name} ${member.user.last_name}`,
        role: member.role,
    }));

    return {
        id: apiProject.id.toString(),
        title: apiProject.short_name,
        description: apiProject.name,
        short_name_slug: apiProject.short_name_slug,
        members: projectMembers,
        alterProjectNo: apiProject.alter_project_no,
        employer: apiProject.employer,
        location: apiProject.location,
        country: apiProject.country,
    };
}

export async function fetchData(): Promise<{ projects: AppProject[]; users: ApiUser[] }> {
    try {
        const response = await fetch('https://portal.alter.com.tr/api/data');
        if (!response.ok) {
            if (response.status === 404) {
                console.error("Data not found at the specified URL.");
            } else {
                console.error(`Failed to fetch data with status: ${response.status}`);
            }
            return { projects: [], users: [] };
        }
        const apiData: { projects: ApiProject[]; users: ApiUser[] } = await response.json();

        if (!apiData || !Array.isArray(apiData.projects)) {
            console.error("Fetched data is not in the expected format (missing or invalid 'projects' array).");
            return { projects: [], users: apiData.users || [] };
        }
        
        const mappedProjects = apiData.projects.map(mapApiProjectToAppProject);

        return {
            projects: mappedProjects,
            users: apiData.users || []
        };
    } catch (error) {
        console.error("A network or parsing error occurred while fetching data:", error);
        return { projects: [], users: [] };
    }
}
