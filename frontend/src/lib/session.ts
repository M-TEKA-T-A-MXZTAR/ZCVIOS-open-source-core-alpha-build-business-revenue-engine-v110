import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const requireSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session;
};
