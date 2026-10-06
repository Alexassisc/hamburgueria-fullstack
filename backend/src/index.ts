import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: 'API da Haburgueria está rodando!' });
});

app.get('/products', async (req, resp) => {
  try {
    const products = await prisma.product.findMany();
    return resp.json(products);
  } catch (e) {
    console.error(e);
    return resp.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    if (!userId || !items || items.length === 0 || !total) {
      return res
        .status(400)
        .json({ error: 'Dados incompletos para criar o pedido' });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: items.map(
            (item: { productId: string; quantity: number; price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            }),
          ),
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json(order);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
