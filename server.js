const pool = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/usuarios', async (req, res) => {
  const dados = req.body;

  try {
    const dataAtendimentoTratada = dados.dataAtendimento || null;

    const query = `
      INSERT INTO usuarios(
        nome, funcao, cpf, matricula, telefone, sexo, dataatendimento,
        deficiencia, tipodeficiencia, acidenteTrabalho, doencaocupacional,
        afastamentoinss, admissional, periodico, retornotrabalho,
        mudancafuncao, tratamentomedico, medicamentocontinuo,
        algumadoenca, doencacoracao, faltaar, pernasinchadas,
        alergico, diabetico, transfusaosangue, cirurgia, fratura,
        atividadefisica, fuma, bebida, drogas, transtornomental,
        anotacao, conclusao
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,
        $20,$21,$22,$23,$24,$25,$26,$27,$28,
        $29,$30,$31,$32,$33,$34
      )
      RETURNING *;
    `;

    const values = [
      dados.nome,
      dados.funcao,
      dados.cpf,
      dados.matricula,
      dados.telefone,
      dados.sexo,
      dataAtendimentoTratada,
      dados.deficiencia,
      dados.tipodeficiencia,
      dados.acidentetrabalho,
      dados.doencaocupacional,
      dados.afastamentoinss,
      dados.admissional,
      dados.periodico,
      dados.retornotrabalho,
      dados.mudancafuncao,
      dados.tratamentomedico,
      dados.medicamentocontinuo,
      dados.algumadoenca,
      dados.doencacoracao,
      dados.faltaar,
      dados.pernasinchadas,
      dados.alergico,
      dados.diabetico,
      dados.transfusaosangue,
      dados.cirurgia,
      dados.fratura,
      dados.atividadefisica,
      dados.fuma,
      dados.bebida,
      dados.drogas,
      dados.transtornomental,
      dados.anotacao,
      dados.conclusao,
    ];

    const resultado = await pool.query(query, values);

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      dados: resultado.rows[0],
    });
  } catch (error) {
    console.error('Erro real:', error);
    res.status(500).json({
      erro: 'Erro interno no servidor',
    });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM usuarios ORDER BY id DESC',
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get('/usuarios/:cpf', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE cpf = $1 ORDER BY id DESC',
      [req.params.cpf],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

//
