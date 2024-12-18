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

type User = {
  username: string;
  token: string;
};

export function ListProducts() {
  const { user } = useContext(Context);
  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [currentCartId, setCurrentCartId] = useState<number | null>(null);
  const [userByToken, setUserByToken] = useState<User | null>(null);

  useEffect(() => {
    if (user?.token) {
      fetchUserByToken(user.token).catch((err) => setErrors(err.message));
    }
    fetching().catch((err) => setErrors(err.message));
  }, [user]);

  useEffect(() => {
    if (userByToken) {
      fetchUserCart().catch((err) => setErrors(err.message));
    }
  }, [userByToken]);

  async function fetching() {
    try {
      const res = await fetch('http://localhost:3000/products');
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setErrors('Error fetching products: ' + err.message);
    }
  }

  async function fetchUserByToken(token: string) {
    try {
      console.log('Fetching user with token:', token);
      const res = await fetch(`http://localhost:3000/users/${token}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const userData = await res.json();
      console.log('User data fetched:', userData);
      setUserByToken(userData);
    } catch (err: any) {
      setErrors('Error fetching user: ' + err.message);
    }
  }

  async function fetchUserCart() {
    const username: string | undefined = userByToken?.username;
    if (!username) return;

    try {
      console.log('Fetching cart for user:', username);
      const res = await fetch('http://localhost:3000/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      const allCarts = await res.json();
      console.log('Carts fetched:', allCarts);
      setCarts(allCarts);

      const userCart = allCarts.find((cart: Cart) => cart.username === username);

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

        if (!createCartRes.ok) throw new Error('Failed to create cart');
        const newCart = await createCartRes.json();
        setCarts([...allCarts, newCart]);
        setCurrentCartId(newCart.id);
      }
    } catch (err: any) {
      setErrors('Error fetching user cart: ' + err.message);
    }
  }

  const addToCart = async (productId: number) => {
    if (!currentCartId) {
      setErrors('No cart available');
      return;
    }

    try {
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
    } catch (err: any) {
      setErrors('Error adding product to cart: ' + err.message);
    }
  };

  return (
    <>
      <h2 className="mb-4">Crochet plushies</h2>
      {errors && <p className="text-danger">{errors}</p>}
      <Row>
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((e) => (
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
                    {user ? (
                      <li className="list-group-item">
                        <Button variant="dark" onClick={() => addToCart(e.sku)}>
                          Add to Cart
                        </Button>
                      </li>
                    ) : (
                      <></>
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </>
  );
}
