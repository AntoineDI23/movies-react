import { useContext, useMemo, useState } from "react";
import { Link } from "react-router";
import { WishlistContext } from "../../context/WishlistProvider";
import styles from "./Wishlist.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Liste de souhaits</h1>
      <p className={styles.subtitle}>
        Retrouve ici les films que tu veux regarder plus tard.
      </p>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Rechercher dans la liste de souhaits…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.badgeInfo} title="Nombre de films dans la liste de souhaits">
          Films enregistrés <span className={styles.badgeNumber}>{wishlist.length}</span>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <p className={styles.message}>Liste vide</p>
      ) : filtered.length === 0 ? (
        <p className={styles.message}>
          Aucun film ne correspond à ta recherche.
        </p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((m) => {
            const poster = m.poster_path ? `${posterBase}${m.poster_path}` : null;

            return (
              <article key={m.id} className={styles.card}>
                <div className={styles.posterWrapper}>
                  {poster ? (
                    <img src={poster} alt={m.title} className={styles.poster} />
                  ) : (
                    <div className={styles.noPoster}>Pas d’affiche</div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.movieTitle}>{m.title}</h3>

                  <p className={styles.meta}>
                    ⭐ {Number(m.vote_average ?? 0).toFixed(1)}
                    {m.release_date ? ` • ${m.release_date}` : ""}
                  </p>

                  <div className={styles.actions}>
                    <Link to={`/movie/${m.id}`} className={styles.link}>
                      <button type="button" className={styles.detailsButton}>
                        Voir les détails
                      </button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(m.id)}
                      className={styles.deleteButton}
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
