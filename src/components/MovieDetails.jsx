import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { WishlistContext } from "../context/WishlistProvider";

const MovieDetails = () => {
  const { id } = useParams();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const posterBase = "https://image.tmdb.org/t/p/w500";
  const profileBase = "https://image.tmdb.org/t/p/w185";
  const backdropBase = "https://image.tmdb.org/t/p/w1280";

  const inWishlist = useMemo(
    () => isInWishlist(Number(id)),
    [id, isInWishlist]
  );

  useEffect(() => {
    if (!apiKey) {
      setError("Clé API manquante");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL(`https://api.themoviedb.org/3/movie/${id}`);
        url.searchParams.set("api_key", apiKey);
        url.searchParams.set("language", "fr-FR");
        url.searchParams.set("append_to_response", "credits");

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Erreur API TMDb (${res.status})`);

        const data = await res.json();
        setMovie(data);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();

    return () => controller.abort();
  }, [apiKey, id]);

  const toggleWishlist = () => {
    if (!movie) return;
    if (inWishlist) removeFromWishlist(movie.id);
    else addToWishlist(movie);
  };

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <Link to="/">← Retour</Link>
        <p style={{ marginTop: 12 }}>Chargement…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <Link to="/">← Retour</Link>
        <p style={{ marginTop: 12, color: "crimson" }}>❌ {error}</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ padding: 16 }}>
        <Link to="/">← Retour</Link>
        <p style={{ marginTop: 12 }}>Film introuvable.</p>
      </div>
    );
  }

  const poster = movie.poster_path ? `${posterBase}${movie.poster_path}` : null;
  const backdrop = movie.backdrop_path
    ? `${backdropBase}${movie.backdrop_path}`
    : null;

  const cast = movie.credits?.cast?.slice(0, 10) ?? [];

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <Link to="/">← Retour</Link>

      {backdrop && (
        <div
          style={{
            marginTop: 12,
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #e6e6e6",
            background: "#f3f3f3",
          }}
        >
          <img
            src={backdrop}
            alt={`Backdrop ${movie.title}`}
            style={{ width: "100%", height: 260, objectFit: "cover" }}
          />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <div>
          <div
            style={{
              border: "1px solid #e6e6e6",
              borderRadius: 14,
              overflow: "hidden",
              background: "#f3f3f3",
              height: 330,
            }}
          >
            {poster ? (
              <img
                src={poster}
                alt={movie.title}
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

          <button
            type="button"
            onClick={toggleWishlist}
            style={{
              width: "100%",
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: inWishlist ? "#ffecec" : "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {inWishlist ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
          </button>
        </div>

        <div>
          <h1 style={{ margin: "0 0 6px" }}>{movie.title}</h1>

          {movie.tagline && (
            <p
              style={{ margin: "0 0 10px", color: "#666", fontStyle: "italic" }}
            >
              {movie.tagline}
            </p>
          )}

          <p style={{ margin: "0 0 10px", color: "#444" }}>
            ⭐ {Number(movie.vote_average).toFixed(1)}{" "}
            <span style={{ color: "#777" }}>({movie.vote_count} votes)</span>
          </p>

          <p style={{ margin: "0 0 10px", color: "#444" }}>
            <b>Date de sortie :</b> {movie.release_date || "—"}
            {"  "}•{"  "}
            <b>Durée :</b> {movie.runtime ? `${movie.runtime} min` : "—"}
          </p>

          {movie.genres?.length > 0 && (
            <p style={{ margin: "0 0 12px", color: "#444" }}>
              <b>Genres :</b> {movie.genres.map((g) => g.name).join(", ")}
            </p>
          )}

          <h2 style={{ margin: "16px 0 8px" }}>Résumé</h2>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            {movie.overview || "Aucun résumé disponible."}
          </p>
        </div>
      </div>

      <h2 style={{ margin: "22px 0 10px" }}>Acteurs principaux</h2>

      {cast.length === 0 ? (
        <p>Aucun casting disponible.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 12,
          }}
        >
          {cast.map((a) => {
            const profile = a.profile_path
              ? `${profileBase}${a.profile_path}`
              : null;

            return (
              <article
                key={a.id}
                style={{
                  border: "1px solid #e6e6e6",
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ height: 220, background: "#f3f3f3" }}>
                  {profile ? (
                    <img
                      src={profile}
                      alt={a.name}
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
                      Pas de photo
                    </div>
                  )}
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontWeight: 800 }}>{a.name}</div>
                  <div style={{ color: "#666" }}>{a.character}</div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
