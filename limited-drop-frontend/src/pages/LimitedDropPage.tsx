import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { createGuestUser } from "../api/users";

const USER_ID_KEY = "limited-drop-user-id";
const DEFAULT_USER_ID = "e2696d79-2b35-4f85-866e-d64dad413efc";

export const LimitedDropPage = () => {
  const { products, loading } = useProducts();
  const [userId, setUserId] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    if (DEFAULT_USER_ID) {
      localStorage.setItem(USER_ID_KEY, DEFAULT_USER_ID);
      setUserId(DEFAULT_USER_ID);
      setUserLoading(false);
      return;
    }

    const existingUserId = localStorage.getItem(USER_ID_KEY);
    if (existingUserId) {
      setUserId(existingUserId);
      setUserLoading(false);
      return;
    }

    let active = true;

    const initUser = async () => {
      try {
        setUserLoading(true);
        const user = await createGuestUser();
        if (!active) {
          return;
        }
        localStorage.setItem(USER_ID_KEY, user.id);
        setUserId(user.id);
      } catch (error: any) {
        if (!active) {
          return;
        }
        setUserError(error.response?.data?.message || error.message || "Failed to initialize user session");
      } finally {
        if (active) {
          setUserLoading(false);
        }
      }
    };

    initUser();

    return () => {
      active = false;
    };
  }, []);

  if (loading || userLoading) {
    return (
      <main className="drop-page">
        <div className="drop-shell">
          <p className="drop-loading">Preparing your drop session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="drop-page">
      <div className="drop-shell">
        <header className="drop-header">
          <p className="drop-eyebrow">Limited Edition Release</p>
          <h1>Blue Wave Drop</h1>
          <p className="drop-subtitle">
            Reserve quickly before stock runs out. Active reservations hold inventory for 5 minutes.
          </p>
        </header>

        <section className="drop-grid" aria-live="polite">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} userId={userId} />
          ))}
        </section>

        {userError && <p className="drop-empty">{userError}</p>}
        {products.length === 0 && <p className="drop-empty">No products yet. Add some from the backend.</p>}
      </div>
    </main>
  );
};