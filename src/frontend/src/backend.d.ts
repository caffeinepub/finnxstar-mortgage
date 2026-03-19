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
    metaDescription: string;
    title: string;
    content: string;
    metaKeywords: string;
    slug: string;
    publishedAt: bigint;
    author: string;
    imageUrl: string;
    metaTitle: string;
    excerpt: string;
    category: string;
}
export interface BlogPostInput {
    metaDescription: string;
    title: string;
    content: string;
    metaKeywords: string;
    slug: string;
    publishedAt: bigint;
    author: string;
    imageUrl: string;
    metaTitle: string;
    excerpt: string;
    category: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(input: BlogPostInput): Promise<BlogPost>;
    deletePost(id: bigint): Promise<void>;
    getAllLeads(): Promise<Array<Lead>>;
    getAllPosts(): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPost(id: bigint): Promise<BlogPost | null>;
    getPostBySlug(slug: string): Promise<BlogPost | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitLead(name: string, email: string, phone: string, loanType: string, timestamp: bigint): Promise<boolean>;
    updatePost(id: bigint, input: BlogPostInput): Promise<BlogPost>;
}
