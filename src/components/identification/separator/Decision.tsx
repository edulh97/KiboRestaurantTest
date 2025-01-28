import { useNavigate } from 'react-router-dom';
import './Decision.css';

function Decision() {

    const navigate = useNavigate();

    return (
        <div className="buttons-container">
            <button className="button1" onClick={() => navigate("/Login-Screen")}>Log in</button>
            <div className="separator">
                <span className="or">or</span>
            </div>
            <button className="button2" onClick={() => navigate("/Guest-Screen")}>Continue as guest</button>
        </div>
    );
}

export default Decision;