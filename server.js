const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // libera o acesso do frontend
app.use(express.json()); // permite receber JSON

// rota para cadastrar usuário
app.post('/usuarios', (req, res) => {
  const {
    id = Date.now(),
    nome,
    funcao,
    cpf,
    matricula,
    telefone,
    sexo,
    dataAtendimento,
    deficiencia,
    tipoDeficiencia,
    acidenteTrabalho,
    doencaOcupacional,
    afastamentoInss,
    admissional,
    periodico,
    retornoTrabalho,
    mudancaFuncao,
  } = req.body;

  // lê o arquivo JSON
  fs.readFile('usuarios.json', 'utf8', (err, data) => {
    let usuarios = [];

    if (!err && data) {
      usuarios = JSON.parse(data);
    }

    usuarios.push({
      id,
      nome,
      funcao,
      cpf,
      matricula,
      telefone,
      sexo,
      dataAtendimento,
      deficiencia,
      tipoDeficiencia,
      acidenteTrabalho,
      doencaOcupacional,
      afastamentoInss,
      admissional,
      periodico,
      retornoTrabalho,
      mudancaFuncao,
    });

    // salva novamente no arquivo
    fs.writeFile('usuarios.json', JSON.stringify(usuarios, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao salvar' });
      }
      res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
    });
  });
});

// rota para buscar usuários (GET)
app.get('/usuarios', (req, res) => {
  fs.readFile('usuarios.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao ler arquivo' });
    }

    const usuarios = data ? JSON.parse(data) : [];
    res.json(usuarios);
  });
});

// buscar usuário pelo CPF
app.get('/usuarios/:cpf', (req, res) => {
  const { cpf } = req.params;

  fs.readFile('usuarios.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao ler arquivo' });
    }

    const usuarios = data ? JSON.parse(data) : [];

    const usuariosEncontrados = usuarios.filter((u) => u.cpf === cpf);

    if (usuariosEncontrados.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuariosEncontrados);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
