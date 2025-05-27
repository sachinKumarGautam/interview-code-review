import React, { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockProducts: Product[] = [
          { id: "1", name: "Product 1", price: 10 },
          { id: "2", name: "Product 2", price: 20 },
          { id: "3", name: "Product 3", price: 15 }
        ];
        setProducts(mockProducts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading Products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name} - ${product.price.toFixed(2)}
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
