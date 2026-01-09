import { useContext } from "react";
import { NavLink } from "react-router";
import { WishlistContext } from "../context/WishlistProvider";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { wishlist } = useContext(WishlistContext);

  const linkClassName = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.linkActive : ""}`;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <NavLink to="/" className={linkClassName}>
            🎬 Films
          </NavLink>

          <NavLink to="/wishlist" className={linkClassName}>
            ⭐ Wishlist
            <span
              className={styles.badge}
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
