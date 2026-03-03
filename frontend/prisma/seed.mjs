import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL,
  }),
});

const toMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const cents = (value) => Math.round(value * 100);

async function run() {
  const demoEmail = "demo@zcvios.local";
  const passwordHash = await bcrypt.hash("DemoPass123!", 10);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Demo Operator",
      businessType: "service",
      businessDescription: "Solo plumbing and emergency callout business.",
      hoursAvailablePerWeek: 42,
      weeklyRevenueBaselineCents: cents(1500),
      targetMonthlyIncomeCents: cents(10000),
      targetMaxHoursPerWeek: 35,
      consistencyWindowMonths: 6,
    },
    create: {
      email: demoEmail,
      passwordHash,
      name: "Demo Operator",
      businessType: "service",
      businessUrl: "https://example-plumbing.local",
      socialLinks: "https://instagram.com/example-plumbing,https://facebook.com/example-plumbing",
      businessDescription: "Solo plumbing and emergency callout business.",
      hoursAvailablePerWeek: 42,
      weeklyRevenueBaselineCents: cents(1500),
      targetMonthlyIncomeCents: cents(10000),
      targetMaxHoursPerWeek: 35,
      consistencyWindowMonths: 6,
      fullLoggingEnabled: true,
      commandMode: true,
    },
  });

  const now = new Date();
  const thisMonday = toMonday(now);
  const weekStarts = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(thisMonday);
    d.setDate(d.getDate() - (5 - i) * 7);
    return d;
  });

  const weeklyRevenue = [1200, 1350, 1400, 1700, 1900, 2100];
  const weeklyLevers = [
    "Traffic",
    "Distribution",
    "Distribution",
    "Conversion",
    "Conversion",
    "Pricing",
  ];

  for (let i = 0; i < weekStarts.length; i += 1) {
    const weekStart = weekStarts[i];
    await prisma.weeklyRevenue.upsert({
      where: { userId_weekStart: { userId: user.id, weekStart } },
      update: { revenueCents: cents(weeklyRevenue[i]), strategyTriggered: true },
      create: {
        userId: user.id,
        weekStart,
        revenueCents: cents(weeklyRevenue[i]),
        strategyTriggered: true,
        note: "Seeded weekly revenue",
      },
    });

    await prisma.weeklyStrategy.upsert({
      where: { userId_weekStart: { userId: user.id, weekStart } },
      update: {
        selectedLever: weeklyLevers[i],
        reasoningSummary: "Seeded strategy for demo timeline.",
        growthStatus: "within_target",
        executionStatus: "moderate",
        driftStatus: i > 3 ? "moderate" : "low",
        leverChangeRecommended: false,
        allocationAdjustment: "none",
      },
      create: {
        userId: user.id,
        weekStart,
        selectedLever: weeklyLevers[i],
        reasoningSummary: "Seeded strategy for demo timeline.",
        growthStatus: "within_target",
        executionStatus: "moderate",
        driftStatus: i > 3 ? "moderate" : "low",
        leverChangeRecommended: false,
        allocationAdjustment: "none",
      },
    });

    for (let d = 0; d < 5; d += 1) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + d);
      await prisma.dailyLog.create({
        data: {
          userId: user.id,
          date,
          minutes: 50 + d * 5,
          category: d % 2 === 0 ? "LEVER" : "ASSET_BUILD",
          completed: true,
          note: "Seeded execution log",
        },
      });
      await prisma.dailyLog.create({
        data: {
          userId: user.id,
          date,
          minutes: 25,
          category: d % 3 === 0 ? "DRIFT" : "MAINTENANCE",
          completed: true,
          note: "Seeded maintenance log",
        },
      });
    }
  }

  console.log("Seed complete. Demo login: demo@zcvios.local / DemoPass123!");
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
