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
      },
    });
  }
  
  const generateDecimal = (lDigits: number, rDigits: number): number => {
    const integerPart = faker.number.bigInt({ min: 10 ** (lDigits - 1), max: 10 ** lDigits - 1 });
    const decimalPart = faker.number.bigInt({ min: 10 ** (rDigits - 1), max: 10 ** rDigits - 1 });
    return parseFloat(`${integerPart}.${decimalPart}`);
  }

  const yarnTypes = Object.values(YarnTypes);
  for (let i = 0; i < 10; i++) {
    await prisma.product.create({
      data: {
        sku: i +1,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: new Prisma.Decimal(generateDecimal(2, 2)),
        discount: faker.datatype.boolean() ? new Prisma.Decimal(generateDecimal(3, 3)) : null,
        yarn: faker.helpers.arrayElement(yarnTypes),
        size: new Prisma.Decimal(generateDecimal(3, 2)),
      }
    });
  }
  
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();


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
