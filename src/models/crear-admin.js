require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario');  // ← Mira que dice src/
const bcrypt = require('bcryptjs');

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
    
    const existe = await Usuario.findOne({ email: 'admin@lamaison.com' });
    if (existe) {
      console.log('ℹ️ El admin ya existe');
      console.log('Email: admin@lamaison.com');
      console.log('Password: admin123');
      process.exit(0);
    }
    
    const hashed = await bcrypt.hash('admin123', 10);
    const admin = new Usuario({
      nombre: 'Administrador',
      email: 'admin@lamaison.com',
      password: hashed,
      telefono: '3000000000',
      rol: 'admin'
    });
    
    await admin.save();
    console.log('✅ ADMIN CREADO');
    console.log('Email: admin@lamaison.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

crearAdmin();