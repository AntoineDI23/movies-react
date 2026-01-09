import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import MovieList from "./components/MovieList/MovieList";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import Wishlist from "./components/Wishlist/Wishlist";
import Layout from "./components/Layout";
import WishlistProvider from "./context/WishlistProvider";

function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<MovieList />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WishlistProvider>
  );
}

export default App;
