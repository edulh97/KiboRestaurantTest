import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Header from "../../components/headers-components/header/Header";
import LoginOrderForm from "../../components/identification/login-order-form/LoginOrderForm";
import LoginSubtitle from "../../components/headers-components/subtitle-login/LoginSubtitle";
import BackButton from '../../components/back-button/BackButton';

function LoginScreen() {
    const navigate = useNavigate();
    const handlers = useSwipeable({
        
        onSwipedRight: () => navigate('/Login-Menu'),
        trackMouse: true,
    });

    return (
        <div {...handlers}>
        <Header/>
        <BackButton/>
        <LoginSubtitle/>
        <LoginOrderForm/>
        </div>
    )
}

export default LoginScreen;