import { useState } from "react";
import { Product } from "../api/products";
import { reserveProduct, Reservation } from "../api/reservations";
import { ReservationTimer } from "./ReservationTimer";

interface Props {
  product: Product;
  userId: string;
}

export const ProductCard = ({ product, userId }: Props) => {
  const [reserving, setReserving] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState("");

  const handleReserve = async () => {
    setReserving(true);
    setError("");
    try {
      const res = await reserveProduct(userId, product.id);
      setReservation(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setReserving(false);
    }
  };

  const handleExpire = () => {
    setReservation(null);
    setError("Reservation expired");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem" }}>
      <h3>{product.name}</h3>
      <p>Stock: {product.stock}</p>
      {reservation ? (
        <p>
          Reserved! <ReservationTimer expiresAt={reservation.expiresAt} onExpire={handleExpire} />
        </p>
      ) : (
        <button onClick={handleReserve} disabled={reserving || product.stock <= 0}>
          {reserving ? "Reserving..." : "Reserve"}
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};