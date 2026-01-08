import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

const CATEGORIES = [
  { key: "now_playing", label: "Now Playing" },
  { key: "popular", label: "Popular" },
  { key: "top_rated", label: "Top Rated" },
  { key: "upcoming", label: "Upcoming" },
];

const MovieList = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [category, setCategory] = useState("popular");
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const posterBase = "https://image.tmdb.org/t/p/w342";

  const effectiveQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (!apiKey) {
      setError("Clé API manquante.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = "https://api.themoviedb.org/3";
        const url = new URL(baseUrl);

        if (effectiveQuery.length > 0) {
          url.pathname = "/3/search/movie";
          url.searchParams.set("query", effectiveQuery);
        } else {
          url.pathname = `/3/movie/${category}`;
        }

        url.searchParams.set("api_key", apiKey);
        url.searchParams.set("language", "fr-FR");

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Erreur API TMDb (${res.status})`);

        const data = await res.json();
        setMovies(data.results ?? []);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchMovies, 350);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [apiKey, category, effectiveQuery]);

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Films</h1>

      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #ddd",
              cursor: "pointer",
              fontWeight: c.key === category ? 700 : 400,
              background: c.key === category ? "#f2f2f2" : "#fff",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Rechercher un film…"
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

      {loading && <p style={{ marginTop: 12 }}>Chargement…</p>}
      {error && <p style={{ marginTop: 12, color: "crimson" }}>❌ {error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p style={{ marginTop: 12 }}>Aucun résultat.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 16,
          }}
        >
          {movies.map((m) => {
            const poster = m.poster_path
              ? `${posterBase}${m.poster_path}`
              : null;

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
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
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
                    ⭐ {Number(m.vote_average).toFixed(1)}
                  </p>

                  <Link
                    to={`/movie/${m.id}`}
                    style={{ textDecoration: "none" }}
                  >
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
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MovieList;
