import { useEffect, useState } from 'react';

type Products = {
  sku: number,
  name: string,
  description: string,
  price: number,
  discount: number,
  yarn: string
  size: number
};

  export function ListProducts(){
    const [products, setProducts] = useState<Products[]>([]);
    const [errors, setErrors] = useState<string | null>(null);
    useEffect(() => {
        fetch("http://localhost:3000/crochetPlushies")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setProducts(data.data))
            .catch((err) => setErrors(err.message));
    }, []);

    if (errors) {
        return <p>{errors}</p>;
    }

    
  return (
    <>
      <h2 className="mb-4">Crochet plushies</h2>
      <div className="row">
      {products.map((e) => (
        <div key={e.sku} className="col-md-4 col-lg-3 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">{e.name}</h5>
              <ul className="list-group list-group-flush">
              <li className="list-group-item">
                    <strong>Price:</strong> 
                    {e.discount > 0 ? (
                      <>
                        <span style={{ textDecoration: 'line-through' }}>{e.price} $</span> <span>{e.discount} $</span>
                      </>
                    ) : (
                      <span>{e.price} $</span>
                    )}
                  </li>
                <li className="list-group-item">
                  <strong>Yarn:</strong> {e.yarn}
                </li>
                <li className="list-group-item">
                  <strong>:</strong> {e.size} cm
                </li>
                <li className="list-group-item">
                  <strong>Description:</strong> {e.description}
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
        </>
      );
  }


