
import { registerSchema, googleUserSchema } from "@/lib/zod_schemas";

export const saveUserToLocalStorage = async (object: {
  nombre: string;
  email: string;
  password?: string;
  oauthId?: string;
  oauthProvider?: string;
}) => {
  try {
    const isOAuth = object.oauthProvider === "google";

    const parsedData = isOAuth
      ? googleUserSchema.safeParse(object)
      : registerSchema.safeParse(object);

    if (!parsedData.success) {
      console.error("Error de validación:", parsedData.error.format());
      return;
    }
   

    const userToSave = {
      name: object.nombre,
      email: object.email,
      password: object.password ?? "google", // fallback para usuarios OAuth
      oauthId: object.oauthId,
      oauthProvider: object.oauthProvider,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToSave),
    });

    const data = await res.json();
    console.log("Respuesta del backend:", data);
  } catch (error) {
    console.error("Error al guardar usuario:", error);
  }
};
