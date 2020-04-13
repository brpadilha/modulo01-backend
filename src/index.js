const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(cors());
app.use(express.json());

// Métodos HTTP

// GET: Buscar informações no backend
// POST: Criar uma informação no backend
// PUT: Alterar uma informação no backend
// DELETE: Deletar uma informação do backend

// Tipos de Parâmetros

// Query Params: Filtros e paginaçao
// Route Params: Indentificar recursos (Atualizar e deletar)
// Request Body: Conteúdo na hora de criar ou editar um recurso(JSON)

/**
 * Middleware
 *
 * Interceptador de requisições que pode interromper ou alterar dados da requisição
 *
 */

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabe = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabe);

  return next(); //deixando não
}

function validadeProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }

  return next(); //deixando não interromper
}

app.use(logRequests);

app.use("/projects/:id", validadeProjectId);

app.get("/projects", (request, response) => {
  const { title } = request.query;

  const result = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;

  return response.json(result);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;

  const project = {
    id: uuid(),
    title,
    owner,
  };
  projects.push(project);
  return response.json(project);
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.status(200).json(project);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  projects.splice(projectIndex, 1); //remover qual index e quantos daqui para frente.

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("🚀 Back-end started!");
});
