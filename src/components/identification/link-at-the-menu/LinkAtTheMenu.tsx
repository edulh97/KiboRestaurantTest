import { useNavigate } from 'react-router-dom';
import './LinkAtTheMenu.css';

function LinkAtTheMenu() {
    const navigate = useNavigate();

    return (
        <div className="link-container">
            <h2>Or maybe just take a look</h2>
            <h2 className="LinktoMenu" onClick={() => navigate("/Main-Menu")}>At the menu</h2>
        </div>
    );
}

export default LinkAtTheMenu;