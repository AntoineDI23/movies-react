import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { WishlistContext } from "../../context/WishlistProvider";
import styles from "./MovieDetails.module.css";

const MovieDetails = () => {
  const { id } = useParams();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

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

        const detailsUrl = new URL(`https://api.themoviedb.org/3/movie/${id}`);
        detailsUrl.searchParams.set("api_key", apiKey);
        detailsUrl.searchParams.set("language", "fr-FR");
        detailsUrl.searchParams.set("append_to_response", "credits");

        const similarUrl = new URL(
          `https://api.themoviedb.org/3/movie/${id}/similar`
        );
        similarUrl.searchParams.set("api_key", apiKey);
        similarUrl.searchParams.set("language", "fr-FR");

        const [detailsRes, similarRes] = await Promise.all([
          fetch(detailsUrl, { signal: controller.signal }),
          fetch(similarUrl, { signal: controller.signal }),
        ]);

        if (!detailsRes.ok)
          throw new Error(`Erreur API (${detailsRes.status})`);
        if (!similarRes.ok)
          throw new Error(`Erreur API (${similarRes.status})`);

        const detailsData = await detailsRes.json();
        const similarData = await similarRes.json();

        setMovie(detailsData);
        setSimilarMovies((similarData.results ?? []).slice(0, 12));
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
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Retour
        </Link>
        <p className={styles.message}>Chargement…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Retour
        </Link>
        <p className={styles.error}>❌ {error}</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Retour
        </Link>
        <p className={styles.message}>Film introuvable.</p>
      </div>
    );
  }

  const poster = movie.poster_path ? `${posterBase}${movie.poster_path}` : null;
  const backdrop = movie.backdrop_path
    ? `${backdropBase}${movie.backdrop_path}`
    : null;

  const cast = movie.credits?.cast?.slice(0, 10) ?? [];

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        ← Retour
      </Link>

      {backdrop && (
        <div className={styles.backdropCard}>
          <img
            src={backdrop}
            alt={`Backdrop ${movie.title}`}
            className={styles.backdropImg}
          />
        </div>
      )}

      <div className={styles.topGrid}>
        <div>
          <div className={styles.posterCard}>
            {poster ? (
              <img
                src={poster}
                alt={movie.title}
                className={styles.posterImg}
              />
            ) : (
              <div className={styles.noImage}>Pas d’affiche</div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleWishlist}
            className={`${styles.wishlistButton} ${
              inWishlist ? styles.wishlistButtonActive : ""
            }`}
          >
            {inWishlist ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
          </button>
        </div>

        <div>
          <h1 className={styles.title}>{movie.title}</h1>

          {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}

          <p className={styles.metaLine}>
            ⭐ {Number(movie.vote_average).toFixed(1)}{" "}
            <span className={styles.metaMuted}>({movie.vote_count} votes)</span>
          </p>

          <p className={styles.metaLine}>
            <b>Date de sortie :</b> {movie.release_date || "—"}
            {"  "}•{"  "}
            <b>Durée :</b> {movie.runtime ? `${movie.runtime} min` : "—"}
          </p>

          {movie.genres?.length > 0 && (
            <p className={styles.metaLine}>
              <b>Genres :</b> {movie.genres.map((g) => g.name).join(", ")}
            </p>
          )}

          <h2 className={styles.resumeTitle}>Résumé</h2>
          <p className={styles.overview}>
            {movie.overview || "Aucun résumé disponible."}
          </p>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Acteurs principaux</h2>

      {cast.length === 0 ? (
        <p>Aucun casting disponible.</p>
      ) : (
        <div className={styles.castGrid}>
          {cast.map((a) => {
            const profile = a.profile_path
              ? `${profileBase}${a.profile_path}`
              : null;

            return (
              <article key={a.id} className={styles.card}>
                <div className={styles.cardImageWrap220}>
                  {profile ? (
                    <img
                      src={profile}
                      alt={a.name}
                      className={styles.cardImg}
                    />
                  ) : (
                    <div className={styles.noImage}>Pas de photo</div>
                  )}
                </div>

                <div className={styles.cardBody10}>
                  <div className={styles.actorName}>{a.name}</div>
                  <div className={styles.actorRole}>{a.character}</div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <h2 className={styles.sectionTitle}>Films similaires</h2>

      {similarMovies.length === 0 ? (
        <p>Aucun film similaire trouvé.</p>
      ) : (
        <div className={styles.similarGrid}>
          {similarMovies.map((sm) => {
            const smPoster = sm.poster_path
              ? `${posterBase}${sm.poster_path}`
              : null;

            return (
              <article key={sm.id} className={styles.card}>
                <div className={styles.cardImageWrap280}>
                  {smPoster ? (
                    <img
                      src={smPoster}
                      alt={sm.title}
                      className={styles.cardImg}
                    />
                  ) : (
                    <div className={styles.noImage}>Pas d’affiche</div>
                  )}
                </div>

                <div className={styles.cardBody10}>
                  <div className={styles.similarTitle}>{sm.title}</div>
                  <div className={styles.similarMeta}>
                    ⭐ {Number(sm.vote_average ?? 0).toFixed(1)}
                  </div>

                  <Link to={`/movie/${sm.id}`} className={styles.backLink}>
                    <button type="button" className={styles.detailsButton}>
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

export default MovieDetails;
