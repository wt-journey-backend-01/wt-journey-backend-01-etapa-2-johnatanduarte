// Importa a função v4 do pacote uuid para gerar IDs únicos
const { v4: uuidv4 } = require("uuid");

// Simula um banco de dados em memória usando um array.
// Contém um agente inicial para que a API não comece vazia.
let agentes = [
  {
    id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
    nome: "Rommel Carneiro",
    dataDeIncorporacao: "1992-10-04",
    cargo: "delegado",
  },
];

/**
 * Repositório para operações de dados dos Agentes.
 * A responsabilidade dele é apenas interagir com a "fonte de dados" (nosso array).
 */

// Função que retorna todos os agentes cadastrados.
function findAll() {
  return agentes;
}

// Função para encontrar um agente pelo seu ID.
function findById(id) {
  return agentes.find((agente) => agente.id === id);
}

// Função para criar um novo agente.
function create(agenteData) {
  const novoAgente = {
    id: uuidv4(),
    ...agenteData,
  };
  agentes.push(novoAgente);
  return novoAgente;
}

// Função para atualizar um agente existente.
function update(id, agenteData) {
  const index = agentes.findIndex((agente) => agente.id === id);
  if (index !== -1) {
    const agenteAtualizado = {
      id: id,
      ...agenteData,
    };
    agentes[index] = agenteAtualizado;
    return agenteAtualizado;
  }
  return null;
}

// Função para remover um agente.
function remove(id) {
  const index = agentes.findIndex((agente) => agente.id === id);
  // Se o agente for encontrado.
  if (index !== -1) {
    // Remove 1 elemento a partir do índice encontrado.
    agentes.splice(index, 1);
    // Retorna true para indicar que a remoção foi bem-sucedida.
    return true;
  }
  // Se não encontrar, retorna false.
  return false;
}

// Exporta as funções para que possam ser usadas em outros arquivos.
module.exports = {
  findAll,
  findById,
  create,
  update,
  remove, // Nova função exportada
};
