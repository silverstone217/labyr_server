import { Pool } from "pg";
import { DATABASE_URL } from "../utils/envVariables";
import { prisma } from "./prisma";

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

//
export const getUser = async () => {
  try {
    const res = await prisma.user.findMany();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
