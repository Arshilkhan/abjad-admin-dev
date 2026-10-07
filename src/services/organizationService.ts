import { mockOrganizations } from "../mock/organizations";
import type { Organization } from "../types";
let data = [...mockOrganizations];
// Swap these bodies for API calls later; signatures stay the same.
export const organizationService = {
  getAll: async (): Promise<Organization[]> => [...data],
  getById: async (id: string) => data.find(o => o.id === id),
  create: async (o: Organization) => { data = [o, ...data]; return o; },
  suspend: async (id: string) => { data = data.map(o => o.id === id ? { ...o, status: "Suspended" as const } : o); },
};
