import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Context } from '../context/Context';

type Product = {
  sku: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  yarn: string;
  size: number;
};

type Cart = {
  id: number;
  username: string;
};

export function ListProducts() {
  const { user } = useContext(Context);
  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [currentCartId, setCurrentCartId] = useState<number | null>(null);

  useEffect(() => {
    fetching().catch((err) => setErrors(err.message));
    fetchUserCart().catch((err) => setErrors(err.message));
  }, []);

  if (errors) {
    return <p>{errors}</p>;
  }

  async function fetching() {
    const res = await fetch("http://localhost:3000/products");
    setProducts(await res.json());
  }

  async function fetchUserCart() {
    const username: string | undefined = user?.username;

    if (!username) {
      setErrors("User is not authenticated");
      return;
    }

    const res = await fetch("http://localhost:3000/cart");
    const allCarts: Cart[] = await res.json();
    setCarts(allCarts);

    const userCart = allCarts.find((cart) => cart.username === username);

    if (userCart) {
      setCurrentCartId(userCart.id);
    } else {
      const createCartRes = await fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const newCart: Cart = await createCartRes.json();
      setCarts([...allCarts, newCart]);
      setCurrentCartId(newCart.id);
    }
  }

  const addToCart = async (productId: number) => {
    if (!currentCartId) {
      setErrors("No cart available");
      return;
    }

    const res = await fetch(`http://localhost:3000/cart/${currentCartId}/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentCartId, productId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setErrors(errorData.message);
      return;
    }

    const data = await res.json();
    console.log('Product added to cart successfully', data);
  };

  return (
    <>
      <h2 className="mb-4">Crochet plushies</h2>
      <Row>
        {products.map((e) => (
          <Col key={e.sku} md={4} lg={3} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{e.name}</Card.Title>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Price:</strong>
                    {e.discount > 0 ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: 'red' }}>{e.price} $</span>{' '}
                        <span>{e.discount} $</span>
                      </>
                    ) : (
                      <span>{e.price} $</span>
                    )}
                  </li>
                  <li className="list-group-item">
                    <strong>Yarn:</strong> {e.yarn}
                  </li>
                  <li className="list-group-item">
                    <strong>Size:</strong> {e.size} cm
                  </li>
                  <li className="list-group-item">
                    <strong>Description:</strong> {e.description}
                  </li>
                </ul>
                {user?.username ? (
                  <Button variant="dark" onClick={() => addToCart(e.sku)}>Add to Cart</Button>
                ) : (
                  <></>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
