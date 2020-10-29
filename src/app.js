const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body
  const repository = {
    id: uuid(),//no teste no reactjs por algum motivo ele ta tentando criar um rep com o id 123 e nao cabe a ele tentar estipular o id mas tenho que fazer isso pra ele passar no teste
    title, 
    url,
    techs,
    likes: 0
  }

  if(!isUuid(repository.id)) {//verificando se o id gerado eh valido
    return response.status(500).json({error: "id gerado invalido"})
  }
  repositories.push(repository)//salvando o novo rep no vetor

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title,url,techs}=request.body//pegando as unicas infos que podem ser alteradas

  //procurando primeiro o repositorio pelo id, ele vai retornar o indice dele no vetor
  const repoIndex = repositories.findIndex(repository => repository.id === id)
  
  if(repoIndex<0){
    return response.status(400).json({ message:"Repositorio nao encontrado"})
  }

  const repository = {
    id,
    title: title? title: repositories[repoIndex].title,//verificando se os campos foram setados 
    url: url? url: repositories[repoIndex].url,//caso nao foram a gente so usa o valor antigo msm
    techs: techs? techs: repositories[repoIndex].techs,
    likes: repositories[repoIndex].likes//mantendo id e o likes do repositorio antigo pra poder sobrescrever
  }

  repositories[repoIndex]= repository
  return response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params

  repoIndex = repositories.findIndex(repository=>repository.id === id)//procurando o rep por id
   
  if(repoIndex < 0){
    return response.status(400).json({message:"Repositorio nao encontrado"})
  }

  repositories.splice(repoIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
    const {id} = request.params;

    repoIndex = repositories.findIndex(repository => repository.id === id)

    if(repoIndex < 0){
      return response.status(400).json({message:"Repository not found"})
    }

    const repository = {
      id,
      title: repositories[repoIndex].title,
      url: repositories[repoIndex].url,
      techs: repositories[repoIndex].techs,
      likes: repositories[repoIndex].likes + 1,
    }
    
    repositories[repoIndex] = repository

    return response.json(repository)
});

module.exports = app;
