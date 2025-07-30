// Importa o repositório de casos.
const casosRepository = require("../repositories/casosRepository");

/**
 * Controlador para gerenciar as requisições relacionadas a Casos.
 */

// Função para lidar com a requisição GET para listar todos os casos.
function getAllCasos(req, res) {
  // Chama a função do repositório para obter todos os casos.
  const todosCasos = casosRepository.findAll();
  // Retorna a lista de casos como uma resposta JSON com status 200 (OK).
  res.status(200).json(todosCasos);
}

// Função para lidar com a requisição GET para buscar um caso por ID.
function getCasoById(req, res) {
  // Extrai o ID dos parâmetros da rota.
  const id = req.params.id;
  // Procura o caso no repositório.
  const caso = casosRepository.findById(id);

  // Verifica se o caso foi encontrado.
  if (caso) {
    // Se encontrado, retorna o objeto do caso com status 200 (OK).
    res.status(200).json(caso);
  } else {
    // Se não encontrado, retorna uma mensagem de erro com status 404 (Not Found).
    res.status(404).json({ message: "Caso não encontrado." });
  }
}

// Função para lidar com a requisição POST para criar um novo caso.
function createCaso(req, res) {
  // Pega os dados do novo caso do corpo da requisição.
  const novoCasoData = req.body;

  // Validação dos campos obrigatórios.
  if (
    !novoCasoData.titulo ||
    !novoCasoData.descricao ||
    !novoCasoData.status ||
    !novoCasoData.agente_id
  ) {
    return res.status(400).json({
      message:
        "Dados inválidos. Título, descrição, status e agente_id são obrigatórios.",
    });
  }

  // Validação específica para o campo 'status'.
  if (
    novoCasoData.status !== "aberto" &&
    novoCasoData.status !== "solucionado"
  ) {
    return res.status(400).json({
      message: "Status inválido. O status deve ser 'aberto' ou 'solucionado'.",
    });
  }

  // Chama a função create do repositório.
  const casoCriado = casosRepository.create(novoCasoData);

  // Retorna o caso criado com o status 201 (Created).
  res.status(201).json(casoCriado);
}

// Função para lidar com a requisição PUT para atualizar um caso por completo.
function updateCaso(req, res) {
  const id = req.params.id;
  const casoData = req.body;

  // Validação para garantir que todos os campos foram enviados para a substituição.
  if (
    !casoData.titulo ||
    !casoData.descricao ||
    !casoData.status ||
    !casoData.agente_id
  ) {
    return res.status(400).json({
      message:
        "Dados inválidos. Para o método PUT, todos os campos são obrigatórios: título, descrição, status e agente_id.",
    });
  }
  if (casoData.status !== "aberto" && casoData.status !== "solucionado") {
    return res.status(400).json({
      message: "Status inválido. O status deve ser 'aberto' ou 'solucionado'.",
    });
  }

  const casoAtualizado = casosRepository.update(id, casoData);
  if (casoAtualizado) {
    res.status(200).json(casoAtualizado);
  } else {
    res.status(404).json({ message: "Caso não encontrado." });
  }
}

// Função para lidar com a requisição PATCH para atualizar um caso parcialmente.
function patchCaso(req, res) {
  const id = req.params.id;
  const casoData = req.body;

  // Validação específica para o campo 'status', caso ele tenha sido enviado.
  if (
    casoData.status &&
    casoData.status !== "aberto" &&
    casoData.status !== "solucionado"
  ) {
    return res.status(400).json({
      message: "Status inválido. O status deve ser 'aberto' ou 'solucionado'.",
    });
  }

  const casoAtualizado = casosRepository.update(id, casoData);
  if (casoAtualizado) {
    res.status(200).json(casoAtualizado);
  } else {
    res.status(404).json({ message: "Caso não encontrado." });
  }
}

// Função para lidar com a requisição DELETE para remover um caso.
function deleteCaso(req, res) {
  const id = req.params.id;
  // Tenta remover o caso pelo ID.
  const sucesso = casosRepository.remove(id);

  if (sucesso) {
    // Se a remoção foi bem-sucedida, retorna status 204 sem corpo.
    res.status(204).send();
  } else {
    // Se o caso não foi encontrado, retorna status 404.
    res.status(404).json({ message: "Caso não encontrado." });
  }
}

// Exporta a função para que ela possa ser usada nas rotas.
module.exports = {
  getAllCasos,
  getCasoById,
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso,
};
