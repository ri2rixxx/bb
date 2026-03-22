import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function DetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get(`/items/${id}`).then(res => setItem(res.data));
  }, [id]);

  if (!item) return "Загрузка...";

  return (
    <div>
      <h1>{item.name}</h1>
      <p>Тип: {item.type}</p>
      <p>Статус: {item.status}</p>
      <Link to="/">Назад</Link>
    </div>
  );
}
