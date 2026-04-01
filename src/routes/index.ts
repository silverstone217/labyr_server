import { Router } from "express";
// import { pool } from "../lib/db";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../utils/envVariables";
import { UserLoginSchema, UserLoginType } from "../schema";
import { prisma } from "../lib/prisma";
import { authActionMiddleware } from "../middleware/authMiddleware";

const router = Router();

// WELCOME PAGE SERVER
router.get("/", (req, res) => {
  res.send("Welcome to the Labyr API!");
});

// LOGIN USER
router.post("/auth", async (req, res) => {
  const body = req.body;
  try {
    const revalidated = UserLoginSchema.safeParse(body);

    if (!revalidated.success) {
      return res.status(400).json(revalidated.error);
    }

    const { password, username }: UserLoginType = revalidated.data;

    const result = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!result || result.password !== password) {
      return res
        .status(401)
        .json({ message: "Identifiants invalides", token: null });
    }

    const token = jwt.sign(
      {
        username,
      },
      SECRET_KEY,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // true en production (HTTPS)
      sameSite: "none",
      // maxAge: 1000 * 60 * 60, // 1h
    });

    console.log("User logged in, token cookie set:", token);

    return res.status(200).json({
      message: "Connexion reussie !",
    });
  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({
      message: "Erreur serveur",
      error: String(error),
    });
  }
});

// LOGOUT USER
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true en production
    sameSite: "lax",
  });

  console.log("User logged out, token cookie cleared");

  return res.status(200).json({ message: "Déconnecté avec succès" });
});

// ----------------> ROOMS <-----------------
// add room
router.post("/rooms/nouveau", authActionMiddleware, async (req, res) => {
  try {
    const body = req.body;

    const { name, exits, message } = body;

    // is name already exists ?
    const existingRoom = await prisma.room.findUnique({
      where: {
        name,
      },
    });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Une room avec ce nom existe déjà" });
    }

    // 1. créer la room
    const room = await prisma.room.create({
      data: {
        name,
        adminMessage: message,
      },
    });

    // 2. créer les connexions
    if (exits?.length > 0) {
      await prisma.roomExit.createMany({
        data: exits.map((exit: any) => ({
          fromRoomId: room.id,
          toRoomId: exit.toRoomId,
          direction: exit.direction,
        })),
      });
    }

    res.status(201).json({
      message: "Room créée avec succès",
      roomId: room.id,
    });
  } catch (error) {
    console.error("ERROR CREATE ROOM:", error);
    res.status(500).json({
      message: "Erreur serveur",
      error: String(error),
    });
  }
});

// get rooms
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({});
    res.status(200).json(rooms);
  } catch (error) {
    console.error("ERROR GET ROOMS:", error);
    res.status(500).json({ message: "Erreur serveur", error: String(error) });
  }
});

// get room by id
// update room
// delete room

export default router;
