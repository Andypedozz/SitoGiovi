import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export type AdminProject = {
    id: string;
    title: string;
    description: string;
    image: string;
};

const DATA_FILE_PATH = process.env.PROJECTS_DATA_PATH || resolve(process.cwd(), "src", "data", "projects.json");

const isProject = (value: unknown): value is AdminProject =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === "string" &&
    typeof (value as Record<string, unknown>).title === "string" &&
    typeof (value as Record<string, unknown>).description === "string" &&
    typeof (value as Record<string, unknown>).image === "string";

const normalizeProjects = (data: unknown): AdminProject[] => {
    if (!Array.isArray(data)) return [];
    return data.filter(isProject);
};

export const getProjects = async (): Promise<AdminProject[]> => {
    try {
        const raw = await readFile(DATA_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        return normalizeProjects(parsed);
    } catch (error) {
        console.error("Impossibile leggere projects.json", error);
        return [];
    }
};

export const saveProjects = async (projects: AdminProject[]): Promise<void> => {
    await writeFile(DATA_FILE_PATH, JSON.stringify(projects, null, 4), "utf-8");
};
