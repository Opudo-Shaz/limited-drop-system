import { useState } from "react";
import { Product } from "../api/products";
import { reserveProduct, Reservation } from "../api/reservations";
import { checkoutReservation } from "../api/checkout";
import { ReservationTimer } from "./ReservationTimer";

interface Props {
  product: Product;
  userId: string;
}

export const ProductCard = ({ product, userId }: Props) => {
  const [reserving, setReserving] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReserve = async () => {
    if (!userId) {
      setError("User session not ready. Refresh and try again.");
      return;
    }

    setReserving(true);
    setError("");
    setSuccess("");
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

  const handleCheckout = async () => {
    if (!reservation) {
      return;
    }

    setCheckingOut(true);
    setError("");
    setSuccess("");

    try {
      await checkoutReservation(reservation.id);
      setReservation(null);
      setSuccess("Checkout successful. Order placed.");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <article className="product-card">
      <div className="product-top">
        <h3>{product.name}</h3>
        <p className="product-stock">Stock: {product.stock}</p>
      </div>

      {reservation ? (
        <div className="reservation-section">
          <p className="reservation-pill">
            Reserved <ReservationTimer expiresAt={reservation.expiresAt} onExpire={handleExpire} />
          </p>
          <button className="checkout-btn" onClick={handleCheckout} disabled={checkingOut}>
            {checkingOut ? "Processing..." : "Checkout"}
          </button>
        </div>
      ) : (
        <button className="reserve-btn" onClick={handleReserve} disabled={reserving || product.stock <= 0 || !userId}>
          {reserving ? "Reserving..." : "Reserve"}
        </button>
      )}

      {error && <p className="product-error">{error}</p>}
      {success && <p className="product-success">{success}</p>}
    </article>
  );
};