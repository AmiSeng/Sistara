import { PrismaClient, PhaseName, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createCourseStructure(
  title: string,
  totalMonths: number,
  phases: {
    name: PhaseName;
    months: number[];
  }[]
) {
  // Create or get course
  const course = await prisma.course.upsert({
    where: {
      title
    },
    update: {},
    create: {
      title,
      months: totalMonths
    }
  });

  for (const phaseData of phases) {
    // Create or get phase
    const phase = await prisma.phase.create({
      data: {
        name: phaseData.name,
        courseId: course.id
      }
    });

    for (const monthNumber of phaseData.months) {
      // Create month
      const month = await prisma.month.create({
        data: {
          monthNum: monthNumber,
          phaseId: phase.id
        }
      });

      // Create 4 weeks for every month
      await prisma.week.createMany({
        data: [
          {
            monthId: month.id,
            weekNum: 1
          },
          {
            monthId: month.id,
            weekNum: 2
          },
          {
            monthId: month.id,
            weekNum: 3
          },
          {
            monthId: month.id,
            weekNum: 4
          }
        ]
      });
    }
  }
}

async function main() {
  console.log("Starting database seed...");

  // =========================
  // CREATE ADMIN IF MISSING
  // =========================

  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: Role.ADMIN
    }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await prisma.user.create({
      data: {
        name: "System Admin",
        username: "admin",
        email: "admin@sistara.com",
        phoneNumber: null,
        password: hashedPassword,
        role: Role.ADMIN
      }
    });

    console.log("Admin created");
  } else {
    console.log("Admin already exists, skipping");
  }

  // =========================
  // CREATE CURRICULUM
  // =========================

  console.log("Creating curriculum...");

  // Beginner
  await createCourseStructure("Beginner", 4, [
    {
      name: PhaseName.BEGINNER,
      months: [1, 2, 3, 4]
    }
  ]);

  // Frontend
  await createCourseStructure("Frontend", 2, [
    {
      name: PhaseName.INTERMEDIATE,
      months: [5]
    },
    {
      name: PhaseName.ADVANCED,
      months: [6]
    }
  ]);

  // Backend
  await createCourseStructure("Backend", 3, [
    {
      name: PhaseName.INTERMEDIATE,
      months: [5, 6]
    },
    {
      name: PhaseName.ADVANCED,
      months: [7]
    }
  ]);

  // Fullstack
  await createCourseStructure("Fullstack", 5, [
    {
      name: PhaseName.INTERMEDIATE,
      months: [5, 6, 7]
    },
    {
      name: PhaseName.ADVANCED,
      months: [8, 9]
    }
  ]);

  console.log("Curriculum created successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
