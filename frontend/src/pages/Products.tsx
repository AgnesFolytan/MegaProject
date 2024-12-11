import { useEffect, useState } from 'react';

type Tablet = {
  id: number;
  nev: string;
  ar: number;
  marka: string;
  operacios_rendszer: string;
  processzor_orajel: number;
  processzormagok_szama: number;
  kijelzo_meret: number;
  kijelzo_felbontasa: number;
  ram_merete: number;
  bemutatas: string;
};

  export function ListTablets(){
    const [tablets, setTablets] = useState<Tablet[]>([]);
    const [errors, setErrors] = useState<string | null>(null);
    useEffect(() => {
        fetch("http://localhost:3000/tablets")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setTablets(data.data))
            .catch((err) => setErrors(err.message));
    }, []);

    if (errors) {
        return <p>{errors}</p>;
    }

    
  return (
    <>
      <h2 className="mb-4">Tablet Lista</h2>
      <div className="row">
      {tablets.map((e) => (
        <div key={e.id} className="col-md-4 col-lg-3 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">{e.nev}</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Ár:</strong> {e.ar} Ft
                </li>
                <li className="list-group-item">
                  <strong>Márka:</strong> {e.marka}
                </li>
                <li className="list-group-item">
                  <strong>Operációs rendszer:</strong> {e.operacios_rendszer}
                </li>
                <li className="list-group-item">
                  <strong>Bemutatás:</strong> {e.bemutatas}
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


