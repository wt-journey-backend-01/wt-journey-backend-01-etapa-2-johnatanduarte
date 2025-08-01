// Importa o repositório de agentes que lida com o acesso aos dados.
const agentesRepository = require("../repositories/agentesRepository");
// Importa a biblioteca Zod para validação de esquemas.
const { z } = require("zod");

/**
 * Define o esquema de validação para um agente usando Zod.
 */
const agenteSchema = z.object({
  nome: z
    .string({
      required_error: "O campo 'nome' é obrigatório.",
      invalid_type_error: "O campo 'nome' deve ser uma string.",
    })
    .min(1, { message: "O campo 'nome' não pode estar vazio." }),

  dataDeIncorporacao: z
    .string({ required_error: "O campo 'dataDeIncorporacao' é obrigatório." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "O campo 'dataDeIncorporacao' deve estar no formato YYYY-MM-DD.",
    })
    .refine(
      (dateString) => {
        const dataIncorporacao = new Date(dateString);
        const dataUTC = new Date(
          dataIncorporacao.getUTCFullYear(),
          dataIncorporacao.getUTCMonth(),
          dataIncorporacao.getUTCDate()
        );
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return dataUTC <= hoje;
      },
      { message: "A data de incorporação não pode ser uma data futura." }
    ),

  cargo: z
    .string({
      required_error: "O campo 'cargo' é obrigatório.",
    })
    .min(1, { message: "O campo 'cargo' não pode estar vazio." }),
});

/**
 * Controlador para gerenciar as requisições relacionadas a Agentes.
 */

function getAllAgentes(req, res) {
  const todosAgentes = agentesRepository.findAll();
  res.status(200).json(todosAgentes);
}

function getAgenteById(req, res) {
  const id = req.params.id;
  const agente = agentesRepository.findById(id);
  if (agente) {
    res.status(200).json(agente);
  } else {
    res.status(404).json({ message: "Agente não encontrado." });
  }
}

function createAgente(req, res) {
  try {
    const novoAgenteData = agenteSchema.parse(req.body);
    const agenteCriado = agentesRepository.create(novoAgenteData);
    res.status(201).json(agenteCriado);
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

function updateAgente(req, res) {
  try {
    // **NOVA VALIDAÇÃO**: Impede que o ID seja enviado no corpo da requisição.
    if (req.body.id) {
      return res
        .status(400)
        .json({ message: "Não é permitido alterar o ID de um recurso." });
    }

    const agenteData = agenteSchema.parse(req.body);
    const id = req.params.id;

    const agenteAtualizado = agentesRepository.update(id, agenteData);
    if (agenteAtualizado) {
      res.status(200).json(agenteAtualizado);
    } else {
      res.status(404).json({ message: "Agente não encontrado." });
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

function patchAgente(req, res) {
  try {
    // **NOVA VALIDAÇÃO**: Impede que o ID seja enviado no corpo da requisição.
    if (req.body.id) {
      return res
        .status(400)
        .json({ message: "Não é permitido alterar o ID de um recurso." });
    }

    const agenteData = agenteSchema.partial().parse(req.body);
    const id = req.params.id;

    const agenteAtualizado = agentesRepository.update(id, agenteData);
    if (agenteAtualizado) {
      res.status(200).json(agenteAtualizado);
    } else {
      res.status(404).json({ message: "Agente não encontrado." });
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

function deleteAgente(req, res) {
  const id = req.params.id;
  const sucesso = agentesRepository.remove(id);
  if (sucesso) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Agente não encontrado." });
  }
}

module.exports = {
  getAllAgentes,
  getAgenteById,
  createAgente,
  updateAgente,
  patchAgente,
  deleteAgente,
};
