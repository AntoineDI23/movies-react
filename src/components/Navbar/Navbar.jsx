import { useContext } from "react";
import { NavLink, Link } from "react-router";
import { WishlistContext } from "../../context/WishlistProvider";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { wishlist } = useContext(WishlistContext);

  const linkClassName = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.linkActive : ""}`;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Link to="/" className={styles.brand}>
            🎬 CESIflix
          </Link>

          <div className={styles.links}>
            <NavLink to="/" className={linkClassName}>
              Films
            </NavLink>

            <NavLink to="/wishlist" className={linkClassName}>
              Liste de souhaits
              <span
                className={styles.badge}
                title="Nombre de films dans la liste de souhaits"
              >
                {wishlist.length}
              </span>
            </NavLink>
          </div>
        </div>

        <div className={styles.rightHint}>TMDb • React</div>
      </nav>
    </header>
  );
};

export default Navbar;
