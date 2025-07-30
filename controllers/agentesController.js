// controllers/agentesController.js

// Importa o repositório de agentes que lida com o acesso aos dados.
const agentesRepository = require("../repositories/agentesRepository");

/**
 * Controlador para gerenciar as requisições relacionadas a Agentes.
 * A responsabilidade dele é receber a requisição, chamar a camada de repositório
 * e retornar uma resposta.
 */

// Função para lidar com a requisição GET para listar todos os agentes.
function getAllAgentes(req, res) {
  const todosAgentes = agentesRepository.findAll();
  res.status(200).json(todosAgentes);
}

// Função para lidar com a requisição GET para buscar um agente por ID.
function getAgenteById(req, res) {
  const id = req.params.id;
  const agente = agentesRepository.findById(id);

  if (agente) {
    res.status(200).json(agente);
  } else {
    res.status(404).json({ message: "Agente não encontrado." });
  }
}

// Função para lidar com a requisição POST para criar um novo agente.
function createAgente(req, res) {
  const novoAgenteData = req.body;
  if (
    !novoAgenteData.nome ||
    !novoAgenteData.dataDeIncorporacao ||
    !novoAgenteData.cargo
  ) {
    return res
      .status(400)
      .json({
        message:
          "Dados inválidos. Nome, data de incorporação e cargo são obrigatórios.",
      });
  }
  const agenteCriado = agentesRepository.create(novoAgenteData);
  res.status(201).json(agenteCriado);
}

// Função para lidar com a requisição PUT para atualizar um agente.
function updateAgente(req, res) {
  const id = req.params.id;
  const agenteData = req.body;

  if (!agenteData.nome || !agenteData.dataDeIncorporacao || !agenteData.cargo) {
    return res
      .status(400)
      .json({
        message:
          "Dados inválidos. Nome, data de incorporação e cargo são obrigatórios.",
      });
  }

  const agenteAtualizado = agentesRepository.update(id, agenteData);

  if (agenteAtualizado) {
    res.status(200).json(agenteAtualizado);
  } else {
    res.status(404).json({ message: "Agente não encontrado." });
  }
}

// Função para lidar com a requisição DELETE para remover um agente.
function deleteAgente(req, res) {
  const id = req.params.id;
  // Tenta remover o agente pelo ID.
  const sucesso = agentesRepository.remove(id);

  if (sucesso) {
    // Se a remoção foi bem-sucedida, retorna status 204 sem corpo.
    res.status(204).send();
  } else {
    // Se o agente não foi encontrado, retorna status 404.
    res.status(404).json({ message: "Agente não encontrado." });
  }
}

// Exporta as funções para que possam ser usadas nas rotas.
module.exports = {
  getAllAgentes,
  getAgenteById,
  createAgente,
  updateAgente,
  deleteAgente,
};
