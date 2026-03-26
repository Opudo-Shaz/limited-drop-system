import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";

const USER_ID = "PASTE_YOUR_USER_ID"; // from backend user creation

export const LimitedDropPage = () => {
  const { products, loading } = useProducts();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Limited Drop</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} userId={USER_ID} />
        ))}
      </div>
    </div>
  );
};