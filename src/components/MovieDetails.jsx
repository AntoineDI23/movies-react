import { useParams, Link } from "react-router";

const MovieDetails = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">← Retour</Link>
      <h1>Détails du film</h1>
      <p>Movie ID : {id}</p>
    </div>
  );
};

export default MovieDetails;
