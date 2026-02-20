const pool = require('./db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Banco conectado:', res.rows);
  } catch (err) {
    console.error('Erro na conexão:', err);
  }
})();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/usuarios', async (req, res) => {
  const dados = req.body;

  try {
    // ✅ TRATAMENTO DO CAMPO DATE
    const dataAtendimentoTratada = dados.dataAtendimento || null;

    await pool.query(
      `INSERT INTO usuarios(
        nome, funcao, cpf, matricula, telefone, sexo, dataAtendimento,
        deficiencia, tipoDeficiencia, acidenteTrabalho, doencaOcupacional,
        afastamentoInss, admissional, periodico, retornoTrabalho,
        mudancaFuncao, tratamentoMedico, medicamentoContinuo,
        algumaDoenca, doencaCoracao, faltaAr, pernasInchadas,
        alergico, diabetico, transfusaoSangue, cirugia, fratura,
        atividadeFisica, fuma, bebida, drogas, transtornoMental,
        anotacao, conclusao
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,
        $20,$21,$22,$23,$24,$25,$26,$27,$28,
        $29,$30,$31,$32,$33,$34
      )`,
      [
        dados.nome,
        dados.funcao,
        dados.cpf,
        dados.matricula,
        dados.telefone,
        dados.sexo,
        dataAtendimentoTratada, // ✅ AQUI corrigido
        dados.deficiencia,
        dados.tipoDeficiencia,
        dados.acidenteTrabalho,
        dados.doencaOcupacional,
        dados.afastamentoInss,
        dados.admissional,
        dados.periodico,
        dados.retornoTrabalho,
        dados.mudancaFuncao,
        dados.tratamentoMedico,
        dados.medicamentoContinuo,
        dados.algumaDoenca,
        dados.doencaCoracao,
        dados.faltaAr,
        dados.pernasInchadas,
        dados.alergico,
        dados.diabetico,
        dados.transfusaoSangue,
        dados.cirugia,
        dados.fratura,
        dados.atividadeFisica,
        dados.fuma,
        dados.bebida,
        dados.drogas,
        dados.transtornoMental,
        dados.anotacao,
        dados.conclusao,
      ],
    );

    res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro real:', error);
    res.status(500).json({ erro: error.message });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get('/usuarios/:cpf', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE cpf = $1',
      [req.params.cpf],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
