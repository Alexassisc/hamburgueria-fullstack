import { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react';
import { api } from './services/api';
import type { Product, CartItem } from './types';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Busca os produtos da API Express assim que a página carrega
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get<Product[]>('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    }
    loadProducts();
  }, []);

  // 2. Adiciona um produto ao carrinho
  function handleAddToCart(product: Product) {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  }

  // 3. Altera a quantidade de um item no carrinho
  function handleUpdateQuantity(productId: string, amount: number) {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) => {
            if (item.product.id === productId) {
              const newQuantity = item.quantity + amount;
              return newQuantity > 0
                ? { ...item, quantity: newQuantity }
                : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  }

  // 4. Calcula o total do pedido
  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  // 5. Envia o pedido para o Back-end
  async function handleCheckout() {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      // Por enquanto, enviamos um ID de usuário simulado
      await api.post('/orders', {
        userId: 'user-guest-id',
        total,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });

      setCart([]);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 4000);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Falha ao registrar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans pb-10">
      {/* Cabeçalho */}
      <header className="bg-zinc-950 border-b border-zinc-800 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-500 tracking-wide">
            🍔 DevBurger
          </h1>

          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
          >
            <ShoppingCart size={20} />
            <span>Carrinho</span>
            {cart.length > 0 && (
              <span className="bg-zinc-950 text-amber-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Alerta de Sucesso no Pedido */}
      {orderSuccess && (
        <div className="max-w-6xl mx-auto my-4 p-4 bg-emerald-900/80 border border-emerald-500 rounded-lg flex items-center gap-3 text-emerald-200">
          <CheckCircle size={24} />
          <span>
            Pedido realizado com sucesso! Ele já foi registrado no banco de
            dados.
          </span>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto p-4 mt-6">
        <h2 className="text-xl font-bold mb-6 text-zinc-200 border-l-4 border-amber-500 pl-3">
          Nosso Cardápio
        </h2>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-zinc-100">
                      {product.name}
                    </h3>
                    <span className="text-amber-500 font-bold">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4">
                    {product.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-amber-500 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Plus size={18} /> Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sidebar do Carrinho */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="bg-zinc-950 w-full max-w-md h-full p-6 flex flex-col justify-between border-l border-zinc-800">
            <div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShoppingCart size={20} className="text-amber-500" /> Seu
                  Carrinho
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-zinc-400 hover:text-zinc-100 text-sm cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">
                  Seu carrinho está vazio.
                </p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg border border-zinc-800"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          {item.product.name}
                        </h4>
                        <p className="text-amber-500 text-xs font-medium">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product.id, -1)
                          }
                          className="bg-zinc-800 p-1 rounded hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleAddToCart(item.product)}
                          className="bg-zinc-800 p-1 rounded hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rodapé do Carrinho com Total e Botão de Finalizar */}
            {cart.length > 0 && (
              <div className="border-t border-zinc-800 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-400">Total:</span>
                  <span className="text-xl font-bold text-amber-500">
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-lg transition cursor-pointer"
                >
                  {loading ? 'Processando...' : 'Finalizar Pedido'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
