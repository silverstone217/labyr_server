import { JwtPayload } from "../middlewares/authMiddleware"; // ou autre chemin

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
