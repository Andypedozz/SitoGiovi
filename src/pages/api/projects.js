import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const filePath = join(process.cwd(), "src/data/projects.json");

async function readData() {
  const data = await readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function writeData(data) {
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

export const prerender = false;

// =======================
//        GET
// =======================
export async function GET() {
  const projects = await readData();
  return new Response(JSON.stringify(projects), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// =======================
//        POST
// =======================

function getLastId(projects = []) {
  let lastId = -1;

  projects.forEach(p => {
    if(p.id > lastId) lastId = p.id;
  })

  return lastId;
}

export async function POST({ request }) {
  const { title, description } = await request.json();
  const projects = await readData();

  const newId = getLastId(projects) + 1;
  const newProject = {
    id : newId,
    title : title,
    description : description
  }
  
  projects.push(newProject);

  await writeData(projects);

  return new Response(JSON.stringify(newProject), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

// =======================
//        PUT
// =======================
export async function PUT({ request }) {
  const updatedProject = await request.json();
  const projects = await readData();

  const index = projects.findIndex(p => p.id === updatedProject.id);
  if (index === -1) {
    return new Response("Project not found", { status: 404 });
  }

  projects[index] = updatedProject;
  await writeData(projects);

  return new Response(JSON.stringify(updatedProject), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// =======================
//        DELETE
// =======================
export async function DELETE({ request }) {
  const { id } = await request.json();
  const projects = await readData();

  const newList = projects.filter(p => p.id !== id);

  await writeData(newList);

  return new Response(JSON.stringify({ deleted: id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
