import { PrismaClient, YarnTypes, UserType, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {  
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        type: faker.helpers.arrayElement(Object.values(UserType)),
        promotionalEmails: faker.datatype.boolean(),
      },
    });
  }
  
  const yarnTypes = Object.values(YarnTypes);
  for (let i = 0; i < 10; i++) {
    await prisma.product.create({
      data: {
        sku: i + 1,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: new Prisma.Decimal(faker.commerce.price(1, 100, 2)),
        discount: faker.datatype.boolean() ? new Prisma.Decimal(faker.commerce.price(1, 100, 2)) : null,
        yarn: faker.helpers.arrayElement(yarnTypes),
        size: new Prisma.Decimal(faker.number.float({ min: 10, max: 500, precision: 0.01 })),
      },
    });
  }
  
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  for (let i = 0; i < 10; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    const randomProducts = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 5 }));

    await prisma.purchase.create({
      data: {
        username: randomUser.username,
        products: {
          connect: randomProducts.map((product) => ({ sku: product.sku })),
        },
      },
    });
  }

  console.log("Seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
