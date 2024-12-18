import { useContext, useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Context } from '../context/Context';

type Products = {
    sku: number,
    name: string,
    description: string,
    price: number,
    discount: number,
    yarn: string,
    size: number
};

type Cart = {
    id: number,
    username: string,
    products: Products[]
}

type User = {
    id: number,
    username: string
}

export function Cart() {
    const { user } = useContext(Context);
    const [products, setProducts] = useState<Products[]>([]);
    const [userByToken, setUser] = useState<User | null>(null);
    const [carts, setCarts] = useState<Cart[]>([]);
    const [errors, setErrors] = useState<string | null>(null);
    const [currentCartId, setCurrentCartId] = useState<number | null>(null);

    const token: string | undefined = user?.token;

    useEffect(() => {
        if (token) {
            fetchUserByToken(token).catch((err) => setErrors(err.message));
        }   
    }, [token]);

    useEffect(() => {
        if (userByToken) {
            fetchProducts().catch((err) => setErrors(err.message));
            fetchUserCart().catch((err) => setErrors(err.message));
        }
    }, [userByToken]);

    if (errors) {
        return <p>{errors}</p>;
    }

    async function fetchProducts() {
        try {
            const res = await fetch("http://localhost:3000/products");
            if (!res.ok) throw new Error('Failed to fetch products');
            const productsData = await res.json();
            console.log('Products fetched:', productsData); // Debugging
            setProducts(productsData);
        } catch (err: any) {
            setErrors(err.message);
        }
    }

    async function fetchUserByToken(token: string) {
        try {
            console.log("Fetching user with token:", token);
            const res = await fetch(`http://localhost:3000/users/${token}`);
            if (!res.ok) throw new Error('Failed to fetch user');
            const userData = await res.json();
            console.log("User data fetched:", userData); // Debugging
            setUser(userData);
        } catch (err: any) {
            setErrors(err.message);
        }
    }

    async function fetchUserCart() {
        const username: string | undefined = userByToken?.username;
        if (!username) return;

        try {
            console.log("Fetching cart for user:", username);
            const res = await fetch("http://localhost:3000/cart");
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
            setErrors(err.message);
        }
    }

    const deleteFromCart = async (productId: number) => {
        if (currentCartId === null) return;

        try {
            const res = await fetch(`http://localhost:3000/cart/${currentCartId}/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) {
                const errorData = await res.json();
                setErrors(errorData.message);
                return;
            }

            const data = await res.json();
            console.log('Product deleted from cart', data); // Debugging
            setCarts((prevCarts) =>
                prevCarts.map((cart) =>
                    cart.id === currentCartId ? { ...cart, products: cart.products.filter(p => p.sku !== productId) } : cart
                )
            );
        } catch (err: any) {
            setErrors(err.message);
        }
    }

    const deleteAllFromCart = async () => {
        if (currentCartId === null) return;

        try {
            const res = await fetch(`http://localhost:3000/cart/${currentCartId}/products`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                setErrors(errorData.message);
                return;
            }

            const data = await res.json();
            console.log('All products deleted from cart', data); // Debugging
            setCarts((prevCarts) =>
                prevCarts.map((cart) =>
                    cart.id === currentCartId ? { ...cart, products: [] } : cart
                )
            );
        } catch (err: any) {
            setErrors(err.message);
        }
    };

    return (
        <Container>
            {carts.map((cart) => (
                <Row key={cart.id}>
                    {cart.products.map((e) => (
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
                                        <li>
                                            <Button variant="dark" onClick={() => deleteFromCart(e.sku)}>Delete</Button>
                                        </li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ))}
            <Button variant="dark" onClick={() => deleteAllFromCart()}>Delete all</Button>
        </Container>
    );
}
