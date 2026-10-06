import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Smash Burger',
        description: 'Dois hambúrgueres smash de 90g, queijo cheddar fatiado, picles e molho especial no pão brioche.',
        price: 32.90,
        category: 'Hambúrgueres',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      },
      {
        name: 'Bacon Blast Burger',
        description: 'Hambúrguer artesanal de 180g, muito bacon crocante, queijo prato e geleia de pimenta.',
        price: 38.50,
        category: 'Hambúrgueres',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500',
      },
      {
        name: 'Chicken Crispy',
        description: 'Sobrecoxa de frango empanada super crocante, alface americana, tomate e maionese temperada.',
        price: 29.90,
        category: 'Hambúrgueres',
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500',
      },
      {
        name: 'Batata Frita Rústica',
        description: 'Porção de batatas rústicas fofinhas por dentro e crocantes por fora com alecrim e alho.',
        price: 18.00,
        category: 'Acompanhamentos',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500',
      },
      {
        name: 'Coca-Cola Lata 350ml',
        description: 'Lata de refrigerante trincando de gelada.',
        price: 7.00,
        category: 'Bebidas',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500',
      },
    ],
  });

  console.log('✅ Banco de dados populado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });