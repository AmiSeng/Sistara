import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.user.findUnique({
    where: { email: "admin@sistara.com" },
  });

  if (exists) {
    console.log("Admin already exists. Seed skipped.");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.create({
    data: {
      name: "System Admin",
      username: "admin",
      email: "admin@sistara.com",
      phoneNumber: null,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("System admin created");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
