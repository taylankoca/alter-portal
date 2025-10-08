

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
}

interface ApiCommunication {
    id: number;
    title: string;
    institution: string;
    direction: 'incoming' | 'outgoing';
    code: string;
    communicated_at: string;
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
        title: apiProject.name, // Use the full name as title
        description: apiProject.description,
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
    };
}

export async function fetchData(): Promise<{ projects: AppProject[]; users: ApiUser[] }> {
    try {
        const response = await fetch('https://portal.alter.com.tr/api/projects');
        if (!response.ok) {
            if (response.status === 404) {
                console.error("Data not found at the specified URL.");
            } else {
                console.error(`Failed to fetch data with status: ${response.status}`);
            }
            return { projects: [], users: [] };
        }
        const apiData: { projects: ApiProject[] } = await response.json();

        if (!apiData || !Array.isArray(apiData.projects)) {
            console.error("Fetched data is not in the expected format (missing or invalid 'projects' array).");
            return { projects: [], users: [] };
        }
        
        const mappedProjects = apiData.projects.map(mapApiProjectToAppProject);
        
        // Extract all unique users from all projects
        const allUsers = new Map<number, ApiUser>();
        apiData.projects.forEach(project => {
            (project.members || []).forEach(member => {
                if (member.user && !allUsers.has(member.user.id)) {
                    allUsers.set(member.user.id, {
                        id: member.user.id,
                        first_name: member.user.first_name,
                        last_name: member.user.last_name,
                        email: member.user.email,
                        title: member.user.title,
                        phone: member.user.phone,
                        location: member.user.location,
                    });
                }
            });
        });


        return {
            projects: mappedProjects,
            users: Array.from(allUsers.values())
        };
    } catch (error) {
        console.error("A network or parsing error occurred while fetching data:", error);
        return { projects: [], users: [] };
    }
}

export async function fetchUnitsData(): Promise<{ units: ApiUnit[] }> {
    try {
        const response = await fetch('https://portal.alter.com.tr/api/units');
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
