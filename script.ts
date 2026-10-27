import { prisma } from "./lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "a",
      email: "a@a.com",
      password: "p",
    },
  });
  console.log("Created user:", user);

  const folder = await prisma.folder.create({
    data: {
      name: "Default",
    },
  });

  console.log("Created folder:", folder);

  const allUsers = await prisma.user.findMany();
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
