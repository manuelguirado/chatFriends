import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
console.log("ruta actual:", __dirname);



console.log("MongoDB URI cargada:", process.env.MONGODB_URI);

export const connectDatabase = async () => {
  try {
  const uri = process.env.MONGODB_URI;
  console.log("URI de MongoDB:", uri);

  if (!uri) {
    console.error("No se encontró la URI de MongoDB en las variables de entorno.");
  
    return;
  }

  await mongoose.connect(uri);

  console.log("Conectado a MongoDB!");
  } catch (error) {
    console.error("Error conectando a la base de datos:", error);
  }
};

