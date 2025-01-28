import './Card.css';
import { useNavigate } from 'react-router-dom';

function Cards() {
    const navigate = useNavigate();
    return (
        <div className='cards-container' data-testid="card-container">
            <div className="Category-card" data-testid="card-top">
                <div className="Image-container">
                    <img src="/TopSellerIcon.png" data-testid="fav-image" alt="Icono de fama en japones" />
                </div>
                <div className="Text-container">
                    <p className="Category-text">TOP SELLER</p>
                </div>
            </div>
            <div className="Category-card-nigiris" data-testid="card-nigiris" onClick={() => navigate("/Nigiri1")}>
                <div className="Text-container">
                    <p className="Category-text">NIGIRIS</p>
                </div>
                <div className="Image-container-nigiris">
                    <img src="/nigiris.png" data-testid="nigiris-image" alt="Nigiri de salmon" />
                </div>
            </div>
            <div className="Category-card-makis" data-testid="card-makis">
                <div className="Image-container">
                    <img src="/makis.png" data-testid="makis-image" alt="Makis de salmon y aguacate" />
                </div>
                <div className="Text-container">
                    <p className="Category-text">MAKIS</p>
                </div>
            </div>
            <div className="Category-card-favs" data-testid="card-favs" onClick={() => navigate("/Favorites")}>
                <div className="Text-container">
                    <p className="Category-text">YOUR FAVS!</p>
                </div>
                <div className="Image-container">
                    <img src="/favsicon.png" data-testid="favs-image" alt="Bandeja de sushi" />
                </div>
            </div>
        </div>
    );
}


export default Cards;