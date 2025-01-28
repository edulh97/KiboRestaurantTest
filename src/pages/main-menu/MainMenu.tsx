import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Card from "../../components/categories/Card";
import Header from "../../components/headers-components/header/Header";
import BackButton from '../../components/back-button/BackButton';

function MainMenu() {
    const navigate = useNavigate();
    const handlers = useSwipeable({
        onSwipedLeft: () => navigate('/Nigiri1'),
        onSwipedRight: () => navigate('/Login-Menu'),
        trackMouse: true,
    });

    return (
        <div {...handlers}>
            <Header />
            <BackButton/>
            <Card />
        </div>
    );
}

export default MainMenu;
