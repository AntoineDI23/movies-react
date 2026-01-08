import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import WishlistProvider from "./context/WishlistProvider";

function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WishlistProvider>
  );
}

export default App;
