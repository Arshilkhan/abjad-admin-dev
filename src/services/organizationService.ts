import { supabase } from "../lib/supabase";
import type { Organization, OrgStatus } from "../types";

const apiUrl = (
  import.meta.env.VITE_PLATFORM_ADMIN_API_URL as string | undefined
)?.replace(/\/+$/, "");

interface ApiOrganization {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function mapOrganization(org: ApiOrganization): Organization {
  const statusMap: Record<string, OrgStatus> = {
    active: "Active",
    suspended: "Suspended",
    trial: "Trial",
    cancelled: "Cancelled",
  };

  return {
    id: org.id,
    name: org.name,
    status: statusMap[org.status.toLowerCase()] ?? "Active",
    plan: "Trial",
    users: 0,
    created: org.created_at,
    lastActive: "—",
    usage: 0,
  };
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!apiUrl) {
    throw new Error("VITE_PLATFORM_ADMIN_API_URL is not configured.");
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session?.access_token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${sessionData.session.access_token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof result.error === "string"
        ? result.error
        : `API request failed (${response.status}).`,
    );
  }

  return result as T;
}

export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    const result = await apiRequest<{
      organizations: ApiOrganization[];
    }>("/api/admin/organizations");

    return result.organizations.map(mapOrganization);
  },

  getById: async (id: string): Promise<Organization | undefined> => {
    const result = await apiRequest<{
      organization: ApiOrganization;
    }>(`/api/admin/organizations/${encodeURIComponent(id)}`);

    return result.organization
      ? mapOrganization(result.organization)
      : undefined;
  },

  create: async (_organization: Organization): Promise<Organization> => {
    throw new Error(
      "Organization creation is not connected yet. No organization was created.",
    );
  },

  suspend: async (id: string): Promise<void> => {
    await apiRequest(`/api/admin/organizations/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "suspended" }),
    });
  },
};
