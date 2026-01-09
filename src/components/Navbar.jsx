import { useContext } from "react";
import { NavLink } from "react-router";
import { WishlistContext } from "../context/WishlistProvider";

const Navbar = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#fff",
        borderBottom: "1px solid #e6e6e6",
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? 800 : 600,
              color: "#111",
              padding: "6px 10px",
              borderRadius: 10,
              background: isActive ? "#f2f2f2" : "transparent",
            })}
          >
            🎬 Films
          </NavLink>

          <NavLink
            to="/wishlist"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? 800 : 600,
              color: "#111",
              padding: "6px 10px",
              borderRadius: 10,
              background: isActive ? "#f2f2f2" : "transparent",
              display: "flex",
              alignItems: "center",
              gap: 8,
            })}
          >
            ⭐ Wishlist
            <span
              style={{
                minWidth: 26,
                height: 22,
                display: "inline-grid",
                placeItems: "center",
                padding: "0 6px",
                borderRadius: 999,
                border: "1px solid #ddd",
                background: "#fff",
                fontSize: 12,
                fontWeight: 800,
              }}
              title="Nombre de films dans la wishlist"
            >
              {wishlist.length}
            </span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
