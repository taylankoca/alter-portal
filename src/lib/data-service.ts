

import { API_BASE_URL } from '@/config';
import { slugify } from './utils';
import { cookies } from 'next/headers';
import projectCardImages from '@/app/lib/placeholder-images.json';


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
    slug: string;
    short_name: string;
    short_name_slug: string;
    alter_project_no: string;
    employer: string;
    location: string;
    country: string;
    description: string | null;
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
    slug: string;
    short_name_slug: string;
    alterProjectNo: string;
    employer: string;
    location: string;
    country: string;
    description: string;
    members: AppProjectMember[];
    communications: AppCommunication[];
    image: {
        src: string;
        hint: string;
    };
}

// Uygulama içinde kullanılacak yazışma modeli
export interface AppCommunication extends ApiCommunication {}


// Form-related types from Swagger
export interface FormSummary {
    id: number;
    code: string;
    title: string;
    description: string | null;
    requires_approval: boolean;
    can_submit: boolean;
    can_approve: boolean;
    updated_at: string | null;
}

export interface FormStaticField {
    key: string;
    label: string;
    type: string;
    default: string | null;
    required: boolean;
    read_only: boolean;
    sort_order?: number;
}

export interface FormDynamicField {
    id: number;
    key: string;
    label: string;
    type: string;
    required: boolean;
    read_only: boolean;
    default: string | null;
    options: string[];
    sort_order: number | null;
}

export interface FormDetail {
    id: number;
    code: string;
    title: string;
    description: string | null;
    requires_approval: boolean;
    static_fields: FormStaticField[];
    fields: FormDynamicField[];
    can_submit: boolean;
    can_approve: boolean;
}

export interface UserSummary {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface FormSubmissionListItem {
    id: number;
    form: {
        id: number;
        code: string;
        title: string;
    };
    form_number: string;
    status: string;
    is_archived: boolean;
    submitted_at: string;
    user?: UserSummary;
}

export interface FormSubmissionRecord {
    id: number;
    field_name: string;
    value: string | null;
}

export interface FormApprovalEntry {
    id: number;
    approver_id: number;
    status: 'approved' | 'rejected';
    note: string | null;
    approved_at: string | null;
}

export interface FormSubmissionDetail {
    id: number;
    form: {
        id: number;
        code: string;
        title: string;
    };
    form_number: string;
    status: string;
    is_archived: boolean;
    submitted_at: string;
    user: UserSummary;
    records: FormSubmissionRecord[];
    approvals: FormApprovalEntry[];
    can_approve: boolean;
}

// API'den gelen proje verisini uygulama modeline dönüştüren fonksiyon
function mapApiProjectToAppProject(apiProject: ApiProject, index: number): AppProject {
    const projectMembers = (apiProject.members || [])
        .filter(member => member && member.user) // Güvenlik kontrolü: member ve member.user var mı?
        .map(member => ({
            id: member.user.id,
            name: `${member.user.first_name} ${member.user.last_name}`,
            role: member.role,
        }));
    
    const image = projectCardImages.images[index % projectCardImages.images.length];

    return {
        id: apiProject.id.toString(),
        title: apiProject.name,
        slug: apiProject.slug || slugify(apiProject.name || ''),
        short_name_slug: apiProject.short_name_slug || slugify(apiProject.short_name || ''),
        members: projectMembers,
        alterProjectNo: apiProject.alter_project_no,
        employer: apiProject.employer || '',
        location: apiProject.location || '',
        country: apiProject.country || '',
        description: apiProject.description || '',
        communications: [], // Bu alan sonradan birleştirilecek
        image: {
            src: image.src,
            hint: image.hint,
        },
    };
}

async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
    try {
        const token = cookies().get('auth_token')?.value;
        const headers = new Headers(options.headers || {});
        headers.append('Accept', 'application/json');
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to fetch ${endpoint} with status: ${response.status}. Response: ${errorText}`);
            // Don't throw for 404 on single item requests
            if (response.status === 404 && endpoint.match(/\/\d+$/)) {
                return null;
            }
            throw new Error(`API request failed: ${response.status}`);
        }
        
        return response.json();

    } catch (error) {
        console.error(`A network or parsing error occurred while fetching ${endpoint}:`, error);
        throw error;
    }
}


/**
 * /api/projects endpoint'inden tüm projeleri çeker.
 */
export async function fetchProjects(): Promise<AppProject[]> {
    const data = await fetchFromApi('/api/projects');
    if (!data || !Array.isArray(data.projects)) {
        console.error("Fetched project data is not in the expected format.");
        return [];
    }
    return data.projects.map((project: ApiProject, index: number) => mapApiProjectToAppProject(project, index));
}

/**
 * /api/users endpoint'inden tüm kullanıcıları çeker.
 */
export async function fetchUsers(): Promise<ApiUser[]> {
    const data = await fetchFromApi('/api/users');
    if (!data || !Array.isArray(data.users)) {
        console.error("Fetched user data is not in the expected format.");
        return [];
    }
    return data.users;
}

/**
 * /api/units endpoint'inden tüm birimleri çeker.
 */
export async function fetchUnitsData(): Promise<{ units: ApiUnit[] }> {
    const data = await fetchFromApi('/api/units');
    return { units: data?.units || [] };
}

/**
 * /api/communications endpoint'inden tüm yazışmaları çeker.
 */
export async function fetchCommunications(): Promise<AppCommunication[]> {
     const data = await fetchFromApi('/api/communications');
     if (!data || !Array.isArray(data.communications)) {
        console.error("Fetched communication data is not in the expected format.");
        return [];
    }
    return data.communications;
}

/**
 * /api/communications/{id} endpoint'inden tek bir yazışmayı çeker.
 */
export async function fetchCommunicationById(id: string): Promise<AppCommunication | null> {
    const data = await fetchFromApi(`/api/communications/${id}`);
    if (!data || !data.communication) {
        // 404 will return null, so this handles other unexpected cases
        console.error("Fetched single communication data is not in the expected format.");
        return null;
    }
    return data.communication;
}


// Form Functions
export async function fetchAvailableForms(): Promise<FormSummary[]> {
    const data = await fetchFromApi('/api/forms');
    return data?.forms || [];
}

export async function fetchFormByCode(code: string): Promise<FormDetail | null> {
    const data = await fetchFromApi(`/api/forms/${code}`);
    return data?.form || null;
}

export async function fetchSubmissions(): Promise<{ mine: FormSubmissionListItem[], pending_approvals: FormSubmissionListItem[] }> {
    const data = await fetchFromApi('/api/forms/submissions');
    return data?.submissions || { mine: [], pending_approvals: [] };
}

export async function fetchSubmissionById(id: string): Promise<FormSubmissionDetail | null> {
    const data = await fetchFromApi(`/api/forms/submissions/${id}`);
    return data?.submission || null;
}
