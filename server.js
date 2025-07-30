// Importa o framework Express.
const express = require("express");
// Cria uma instância do aplicativo Express.
const app = express();
// Define a porta em que o servidor irá rodar.
const port = 3000;

// Importa os arquivos de rotas.
const agentesRoutes = require("./routes/agentesRoutes");
const casosRoutes = require("./routes/casosRoutes"); // Nova rota importada

// Middleware para permitir que o Express entenda requisições com corpo em JSON.
app.use(express.json());

// Monta as rotas de agentes e casos no caminho base '/'.
app.use(agentesRoutes);
app.use(casosRoutes); // Nova rota utilizada

// Inicia o servidor e o faz escutar na porta definida.
app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
