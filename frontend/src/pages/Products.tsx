import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

type Products = {
  sku: number,
  name: string,
  description: string,
  price: number,
  discount: number,
  yarn: string
  size: number
};

export function ListProducts() {
  const [products, setProducts] = useState<Products[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  useEffect(() => {
    fetching()
      .catch((err) => setErrors(err.message));
  }, []);

  if (errors) {
    return <p>{errors}</p>;
  }

  async function fetching() {
    const res = await fetch("http://localhost:3000/products")
    setProducts(await res.json());
  }


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
                <Button variant="dark">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

