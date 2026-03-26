import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";

const USER_ID = "PASTE_YOUR_USER_ID"; // from backend user creation

export const LimitedDropPage = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <main className="drop-page">
        <div className="drop-shell">
          <p className="drop-loading">Loading products...</p>
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
            <ProductCard key={p.id} product={p} userId={USER_ID} />
          ))}
        </section>

        {products.length === 0 && <p className="drop-empty">No products yet. Add some from the backend.</p>}
      </div>
    </main>
  );
};