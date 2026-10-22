// Runs during every build: fills an empty database with the starter Lynn Luxe content.
// Never touches a database that already has content.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

db.service
  .count()
  .then(async (n) => {
    await db.$disconnect();
    if (n > 0) return console.log(`Database has ${n} services — skipping seed.`);
    console.log("Empty database — seeding starter content…");
    await import("./seed");
  });
