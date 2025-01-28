// FavoritesPage.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { useFavorites } from "../../context/FavoritesContext";
import "./FavoritesPage.css";
import BackButton from '../../components/back-button/BackButton';


function FavoritesPage() {
  
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  // Configuración de deslizamiento
  const handlers = useSwipeable({
    onSwipedRight: () => navigate('/Main-Menu'),
    trackMouse: true,
  });

  return (
      <div {...handlers} className="favorites-container">
        <BackButton/>
        <h1>Your Favorites</h1>
        {favorites.length > 0 ? (
          <div className="favorites-list">
            {favorites.map((dish, index) => (
              <div key={index} className="favorite-item">
                <h2>{dish}</h2>
                <Link to={`/Nigiri${index +1}`}>View Details</Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No favorites yet. Add some dishes to your favorites!</p>
        )}
      </div>
  );
}

export default FavoritesPage;
