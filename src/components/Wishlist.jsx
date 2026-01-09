import { useContext, useMemo, useState } from "react";
import { Link } from "react-router";
import { WishlistContext } from "../context/WishlistProvider";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const [query, setQuery] = useState("");

  const posterBase = "https://image.tmdb.org/t/p/w342";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return wishlist;
    return wishlist.filter((m) => (m.title || "").toLowerCase().includes(q));
  }, [wishlist, query]);

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Wishlist</h1>

      <input
        type="text"
        placeholder="Rechercher dans la wishlist…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 10,
          borderRadius: 10,
          border: "1px solid #ddd",
        }}
      />

      {wishlist.length === 0 ? (
        <p style={{ marginTop: 12 }}>Ta wishlist est vide.</p>
      ) : filtered.length === 0 ? (
        <p style={{ marginTop: 12 }}>Aucun film ne correspond à ta recherche.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 16,
          }}
        >
          {filtered.map((m) => {
            const poster = m.poster_path ? `${posterBase}${m.poster_path}` : null;

            return (
              <article
                key={m.id}
                style={{
                  border: "1px solid #e3e3e3",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ height: 330, background: "#f3f3f3" }}>
                  {poster ? (
                    <img
                      src={poster}
                      alt={m.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        color: "#666",
                      }}
                    >
                      Pas d’affiche
                    </div>
                  )}
                </div>

                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: "0 0 6px" }}>{m.title}</h3>

                  <p style={{ margin: "0 0 10px", color: "#555" }}>
                    ⭐ {Number(m.vote_average ?? 0).toFixed(1)}
                    {m.release_date ? ` • ${m.release_date}` : ""}
                  </p>

                  <div style={{ display: "flex", gap: 8 }}>
                    <Link to={`/movie/${m.id}`} style={{ flex: 1, textDecoration: "none" }}>
                      <button
                        type="button"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 10,
                          border: "1px solid #ddd",
                          background: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        Voir les détails
                      </button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(m.id)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #e2b2b2",
                        background: "#ffecec",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
