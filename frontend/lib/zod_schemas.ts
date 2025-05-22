import {z} from 'zod';
export const loginSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico no es válido' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
});
export const registerSchema = z.object({
    nombre : z.string().min(1, { message: 'El nombre es obligatorio' }),
    email: z.string().email({ message: 'El correo electrónico no es válido' }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    passwordConfirm: z.string().min(8, { message: 'La confirmación de contraseña es obligatoria' }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Las contraseñas   coinciden',
  path: ['passwordConfirm'],
}).refine((data) => data.password.length >= 8, {
  message: 'La contraseña debe tener al menos 8 caracteres',
});


export const googleUserSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  oauthId: z.string(),
  oauthProvider: z.literal("google"),
});