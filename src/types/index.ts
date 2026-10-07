export type OrgStatus = "Active" | "Trial" | "Suspended" | "Cancelled";
export type PlanName = "Trial" | "Starter" | "Business" | "Enterprise";
export interface Organization { id: string; name: string; status: OrgStatus; plan: PlanName; users: number; created: string; lastActive: string; usage: number; }
