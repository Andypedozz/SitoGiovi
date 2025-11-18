import type { APIRoute } from "astro";
import type { AdminProject } from "../../data/projects";
import { getProjects, saveProjects } from "../../data/projects";

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

const parseRequestBody = async (request: Request) => {
    try {
        return await request.json();
    } catch {
        return {};
    }
};

export const GET: APIRoute = async () => {
    const projects = await getProjects();
    return jsonResponse({ projects });
};

export const POST: APIRoute = async ({ request }) => {
    const payload = await parseRequestBody(request);
    const { id, title, description, image } = payload as Partial<AdminProject>;

    if (!id || !title || !description || !image) {
        return jsonResponse({ message: "Compila tutti i campi obbligatori." }, 400);
    }

    const projects = await getProjects();
    if (projects.some((project) => project.id === id)) {
        return jsonResponse({ message: "Esiste già un progetto con questo slug." }, 409);
    }

    const updated = [{ id, title, description, image }, ...projects];
    await saveProjects(updated);
    return jsonResponse({ projects: updated }, 201);
};

export const PUT: APIRoute = async ({ request }) => {
    const payload = await parseRequestBody(request);
    const { id, title, description, image } = payload as Partial<AdminProject>;

    if (!id) {
        return jsonResponse({ message: "Specifica lo slug del progetto da aggiornare." }, 400);
    }

    const projects = await getProjects();
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) {
        return jsonResponse({ message: "Progetto non trovato." }, 404);
    }

    const nextProject = { ...projects[index] };
    if (typeof title === "string" && title.trim()) nextProject.title = title.trim();
    if (typeof description === "string" && description.trim()) nextProject.description = description.trim();
    if (typeof image === "string" && image.trim()) nextProject.image = image.trim();

    const updated = [...projects];
    updated[index] = nextProject;
    await saveProjects(updated);
    return jsonResponse({ projects: updated });
};

export const DELETE: APIRoute = async ({ request }) => {
    const payload = await parseRequestBody(request);
    const { id } = payload as Partial<AdminProject>;
    if (!id) {
        return jsonResponse({ message: "Specifica lo slug del progetto da eliminare." }, 400);
    }

    const projects = await getProjects();
    if (!projects.some((project) => project.id === id)) {
        return jsonResponse({ message: "Progetto non trovato." }, 404);
    }

    const updated = projects.filter((project) => project.id !== id);
    await saveProjects(updated);
    return jsonResponse({ projects: updated });
};
