const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Caminho do arquivo JSON para persistência
const DATA_FILE = path.join(__dirname, 'appointments.json');

// Função para ler os dados
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Função para escrever os dados
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Rota para obter todos os agendamentos
app.get('/api/appointments', (req, res) => {
  const appointments = readData();
  res.json(appointments);
});

// Rota para criar um novo agendamento
app.post('/api/appointments', (req, res) => {
  const { name, phone, date, time, treatment, price } = req.body;
  if (!name || !date || !time || !treatment) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }
  const appointments = readData();
  const newApp = {
    id: Date.now(),
    name,
    phone: phone || '',
    date,
    time,
    treatment,
    price: price || 0,
    createdAt: new Date().toISOString()
  };
  appointments.push(newApp);
  writeData(appointments);
  res.status(201).json(newApp);
});

// Rota para deletar um agendamento
app.delete('/api/appointments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let appointments = readData();
  const filtered = appointments.filter(app => app.id !== id);
  if (filtered.length === appointments.length) {
    return res.status(404).json({ error: 'Agendamento não encontrado' });
  }
  writeData(filtered);
  res.json({ message: 'Agendamento removido' });
});

app.listen(PORT, () => {
  console.log(`🦷 Servidor rodando na porta ${PORT}`);
});
