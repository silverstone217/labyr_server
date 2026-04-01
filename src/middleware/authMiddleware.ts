import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../utils/envVariables";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  username: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide" });
  }
};

// Middleware pour les actions nécessitant une authentification
export const authActionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  try {
    // 1. récupérer le token (cookie OU header)
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    console.log({ token });

    if (!token) {
      return res.status(401).json({
        message: "Vous devez être connecté pour effectuer cette action",
      });
    }

    // 2. vérifier le token
    const decoded = jwt.verify(token, SECRET_KEY as string) as JwtPayload;

    // 3. attacher au request
    (req as any).user = {
      id: decoded.username,
    };

    // 4. passer au suivant
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide ou expiré",
    });
  }
};
