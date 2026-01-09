import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import styles from "./MovieList.module.css";

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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const posterBase = "https://image.tmdb.org/t/p/w342";
  const effectiveQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    setPage(1);
  }, [category, effectiveQuery]);

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
        url.searchParams.set("page", String(page));

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Erreur API TMDb (${res.status})`);

        const data = await res.json();
        setMovies(data.results ?? []);

        setTotalPages(data.total_pages ?? 1);
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
  }, [apiKey, category, effectiveQuery, page]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Films</h1>

      <div className={styles.categories}>
        {CATEGORIES.map((c) => {
          const isActive = c.key === category;

          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={`${styles.categoryButton} ${
                isActive ? styles.categoryButtonActive : ""
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <input
        type="text"
        placeholder="Rechercher un film…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!canPrev || loading}
        >
          Précédent
        </button>

        <span className={styles.pageInfo}>
          Page {page} / {totalPages}
        </span>

        <button
          type="button"
          className={styles.pageButton}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={!canNext || loading}
        >
          Suivant
        </button>
      </div>

      {loading && <p className={styles.message}>Chargement…</p>}
      {error && <p className={styles.error}>❌ {error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p className={styles.message}>Aucun résultat.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className={styles.grid}>
            {movies.map((m) => {
              const poster = m.poster_path
                ? `${posterBase}${m.poster_path}`
                : null;

              return (
                <article key={m.id} className={styles.card}>
                  <div className={styles.posterWrapper}>
                    {poster ? (
                      <img
                        src={poster}
                        alt={m.title}
                        className={styles.poster}
                      />
                    ) : (
                      <div className={styles.noPoster}>Pas d’affiche</div>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.movieTitle}>{m.title}</h3>
                    <p className={styles.rating}>
                      ⭐ {Number(m.vote_average).toFixed(1)}
                    </p>

                    <Link to={`/movie/${m.id}`} className={styles.link}>
                      <button type="button" className={styles.detailsButton}>
                        Voir les détails
                      </button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.pagination} style={{ marginTop: 16 }}>
            <button
              type="button"
              className={styles.pageButton}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev || loading}
            >
              Précédent
            </button>

            <span className={styles.pageInfo}>
              Page {page} / {totalPages}
            </span>

            <button
              type="button"
              className={styles.pageButton}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!canNext || loading}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieList;
