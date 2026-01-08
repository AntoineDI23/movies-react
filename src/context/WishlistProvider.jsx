import { createContext, useEffect, useMemo, useState } from "react";

export const WishlistContext = createContext(null);

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback;
  } catch {
    return fallback;
  }
}

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? safeParse(saved, []) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (movie) => {
    setWishlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;

      const minimal = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      };

      return [minimal, ...prev];
    });
  };

  const removeFromWishlist = (movieId) => {
    setWishlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isInWishlist = (movieId) => wishlist.some((m) => m.id === movieId);

  const value = useMemo(
    () => ({ wishlist, addToWishlist, removeFromWishlist, isInWishlist }),
    [wishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
