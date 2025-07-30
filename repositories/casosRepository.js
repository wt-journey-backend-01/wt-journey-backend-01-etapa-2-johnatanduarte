// Importa a função v4 do pacote uuid para gerar IDs únicos
const { v4: uuidv4 } = require("uuid");

// Simula um banco de dados em memória para os casos.
const casos = [
  {
    id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
    titulo: "briga de bar no bairro bela vista",
    descricao:
      "garrafas quebradas foram encontradas às 22:33 do dia 10/07/2025 na região do bairro bela vista, resultando em ferimentos da vítima, um homem de 45 anos.",
    status: "aberto",
    agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
  },
];

/**
 * Repositório para operações de dados dos Casos.
 */

// Função que retorna todos os casos cadastrados.
function findAll() {
  return casos;
}

// Função para encontrar um caso pelo seu ID.
function findById(id) {
  // Usa o método find() para buscar o primeiro caso que corresponda ao ID.
  return casos.find((caso) => caso.id === id);
}

// Função para criar um novo caso.
function create(casoData) {
  // Cria um novo objeto de caso, adicionando um ID único.
  const novoCaso = {
    id: uuidv4(),
    ...casoData, // Copia as outras propriedades (titulo, descricao, etc.)
  };
  // Adiciona o novo caso ao array.
  casos.push(novoCaso);
  // Retorna o caso que acabou de ser criado.
  return novoCaso;
}

// Esta é a função crucial para o PUT e PATCH
function update(id, casoData) {
  const index = casos.findIndex((caso) => caso.id === id);
  if (index !== -1) {
    const casoExistente = casos[index];
    // Mescla os dados antigos com os novos, garantindo que o ID não mude
    const casoAtualizado = {
      ...casoExistente,
      ...casoData,
      id: id,
    };
    casos[index] = casoAtualizado;
    return casoAtualizado;
  }
  return null;
}

// Função para remover um caso.
function remove(id) {
  const index = casos.findIndex((caso) => caso.id === id);
  // Se o caso for encontrado.
  if (index !== -1) {
    // Remove 1 elemento a partir do índice encontrado.
    casos.splice(index, 1);
    // Retorna true para indicar sucesso.
    return true;
  }
  // Se não encontrar, retorna false.
  return false;
}

// Exporta a função para que ela possa ser usada em outros arquivos.
module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
