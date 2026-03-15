const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir datos en formato JSON

// 1. Conexión a MongoDB (Asegúrate de que MongoDB esté corriendo localmente en este puerto)
mongoose.connect('mongodb+srv://raftelsilva_db_user:txi2bjOQKjElhHPG@cluster0.b61bmgf.mongodb.net/?appName=Cluster0')
  .then(() => console.log('¡Conectado a MongoDB!'))
  .catch(err => console.error('Error al conectar a Mongo:', err));

// 2. Definir el Modelo de Datos (Esquema)
const TareaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: { type: String, default: '' },
  completada: { type: Boolean, default: false }
});
const Tarea = mongoose.model('Tarea', TareaSchema);

// 3. Rutas CRUD
// CREATE: Crear una nueva tarea
app.post('/api/tareas', async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);
    await nuevaTarea.save();
    // Es CRÍTICO que el backend responda para que Angular sepa que ya terminó
    res.status(201).json(nuevaTarea); 
  } catch (error) {
    console.error('Error al guardar en MongoDB:', error);
    res.status(500).json({ mensaje: 'Error al crear la tarea' });
  }
});

// READ: Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    console.error('🔥 Error al consultar MongoDB:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor', detalle: error.message });
  }
});

// UPDATE: Actualizar una tarea existente por su ID
app.put('/api/tareas/:id', async (req, res) => {
  const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
  res.json(tareaActualizada);
});

// DELETE: Borrar una tarea
app.delete('/api/tareas/:id', async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Tarea eliminada correctamente' });
});

// 4. Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});