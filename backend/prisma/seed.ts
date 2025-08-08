import { PrismaClient, Status, EventType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a Team
  const team = await prisma.team.create({
    data: {
      name: 'LaunchWise Test Team',
    },
  });

  // Create a User
  const user = await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      name: 'Test User',
      teamId: team.id,
    },
  });

  // Create an API Key
  const apiKey = await prisma.apiKey.create({
    data: {
      teamId: team.id,
    },
  });

  // Create an Experiment
  const experiment = await prisma.experiment.create({
    data: {
      name: 'Homepage Button Test',
      description: 'Testing different button colors for conversion rate',
      status: Status.RUNNING,
      teamId: team.id,
      apiKeyId: apiKey.id,
      variants: {
        create: [
          { name: 'Control', trafficSplit: 0.5, isControl: true },
          { name: 'Blue Button', trafficSplit: 0.5, isControl: false },
        ],
      },
    },
    include: { variants: true },
  });

  // Create Events for each variant
  for (const variant of experiment.variants) {
    await prisma.event.createMany({
      data: [
        {
          type: EventType.CLICK,
          variantId: variant.id,
          sessionId: 'sess-1',
          url: 'https://example.com/home',
        },
        {
          type: EventType.CONVERSION,
          variantId: variant.id,
          sessionId: 'sess-1',
          url: 'https://example.com/checkout',
        },
      ],
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
