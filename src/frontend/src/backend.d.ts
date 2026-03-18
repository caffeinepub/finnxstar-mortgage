import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lead {
    name: string;
    email: string;
    loanType: string;
    timestamp: bigint;
    phone: string;
}
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    publishedAt: bigint;
    author: string;
    imageUrl: string;
    excerpt: string;
    category: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(title: string, excerpt: string, content: string, author: string, imageUrl: string, category: string, publishedAt: bigint): Promise<BlogPost>;
    deletePost(id: bigint): Promise<void>;
    getAllLeads(): Promise<Array<Lead>>;
    getAllPosts(): Promise<Array<BlogPost>>;
    getCallerUserRole(): Promise<UserRole>;
    getPost(id: bigint): Promise<BlogPost | null>;
    isCallerAdmin(): Promise<boolean>;
    submitLead(name: string, email: string, phone: string, loanType: string, timestamp: bigint): Promise<boolean>;
}
