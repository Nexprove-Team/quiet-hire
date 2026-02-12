import { auth } from "@hackhyre/db/auth";
import { headers } from "next/headers";

export async function getSession() {
    return auth.api.getSession({ headers: await headers() });
}