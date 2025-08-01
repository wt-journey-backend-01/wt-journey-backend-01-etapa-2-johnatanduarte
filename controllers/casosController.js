// Importa o repositório de casos e o Zod.
const casosRepository = require("../repositories/casosRepository");
const { z } = require("zod");

// Esquema de validação para Casos.
const casoSchema = z.object({
  titulo: z.string({ required_error: "O campo 'titulo' é obrigatório." }),
  descricao: z.string({ required_error: "O campo 'descricao' é obrigatório." }),
  status: z.enum(["aberto", "solucionado"], {
    errorMap: () => ({
      message: "O status deve ser 'aberto' ou 'solucionado'.",
    }),
  }),
  agente_id: z
    .string({ required_error: "O campo 'agente_id' é obrigatório." })
    .uuid({ message: "O 'agente_id' deve ser um UUID válido." }),
});

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
  try {
    const novoCasoData = casoSchema.parse(req.body);
    const casoCriado = casosRepository.create(novoCasoData);
    res.status(201).json(casoCriado);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        campo: err.path.join("."),
        mensagem: err.message,
      }));
      return res
        .status(400)
        .json({ message: "Parâmetros inválidos", errors: errors });
    }
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

// Função para lidar com a requisição PUT para atualizar um caso por completo.
function updateCaso(req, res) {
  try {
    // **NOVA VALIDAÇÃO**: Impede que o ID seja enviado no corpo da requisição.
    if (req.body.id) {
      return res
        .status(400)
        .json({ message: "Não é permitido alterar o ID de um recurso." });
    }

    const casoData = casoSchema.parse(req.body);
    const id = req.params.id;

    const casoAtualizado = casosRepository.update(id, casoData);
    if (casoAtualizado) {
      res.status(200).json(casoAtualizado);
    } else {
      res.status(404).json({ message: "Caso não encontrado." });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        campo: err.path.join("."),
        mensagem: err.message,
      }));
      return res
        .status(400)
        .json({ message: "Parâmetros inválidos", errors: errors });
    }
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

// Função para lidar com a requisição PATCH para atualizar um caso parcialmente.
function patchCaso(req, res) {
  try {
    // **NOVA VALIDAÇÃO**: Impede que o ID seja enviado no corpo da requisição.
    if (req.body.id) {
      return res
        .status(400)
        .json({ message: "Não é permitido alterar o ID de um recurso." });
    }

    const casoData = casoSchema.partial().parse(req.body);
    const id = req.params.id;

    const casoAtualizado = casosRepository.update(id, casoData);
    if (casoAtualizado) {
      res.status(200).json(casoAtualizado);
    } else {
      res.status(404).json({ message: "Caso não encontrado." });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        campo: err.path.join("."),
        mensagem: err.message,
      }));
      return res
        .status(400)
        .json({ message: "Parâmetros inválidos", errors: errors });
    }
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

// ... (função deleteCaso - sem alteração)
function deleteCaso(req, res) {
  const id = req.params.id;
  const sucesso = casosRepository.remove(id);
  if (sucesso) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Caso não encontrado." });
  }
}

// Exporta as funções para que possam ser usadas nas rotas.
module.exports = {
  getAllCasos,
  getCasoById,
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso,
};
