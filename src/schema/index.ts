import z from "zod";

export const UserLoginSchema = z.object({
  username: z
    .string({
      error: "Le nom d'utilisateur est requis",
    })
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(20, "Le nom d'utilisateur ne doit pas dépasser 20 caractères"),

  password: z
    .string({
      error: "Le mot de passe est requis",
    })
    .min(3, "Le mot de passe doit contenir au moins 3 caractères")
    .max(20, "Le mot de passe ne doit pas dépasser 20 caractères"),
});

export type UserLoginType = z.infer<typeof UserLoginSchema>;
