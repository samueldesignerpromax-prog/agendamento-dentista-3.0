const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// Ler dados
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// Escrever dados
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Rotas
app.get('/api/appointments', (req, res) => {
  res.json(readData());
});

app.post('/api/appointments', (req, res) => {
  const { name, phone, date, time, treatment, price } = req.body;
  if (!name || !date || !time || !treatment) {
    return res.status(400).json({ error: 'Campos obrigatórios' });
  }
  const appointments = readData();
  const newApp = { id: Date.now(), name, phone, date, time, treatment, price };
  appointments.push(newApp);
  writeData(appointments);
  res.status(201).json(newApp);
});

app.delete('/api/appointments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let appointments = readData();
  const filtered = appointments.filter(a => a.id !== id);
  if (filtered.length === appointments.length) {
    return res.status(404).json({ error: 'Não encontrado' });
  }
  writeData(filtered);
  res.json({ message: 'Removido' });
});

app.listen(PORT, () => {
  console.log(`🦷 Servidor rodando em http://localhost:${PORT}`);
});
