import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Header from '../../components/headers-components/header/Header';
import LocationRestaurant from '../../components/restaurant-info/location-restaurant/LocationRestaurant';
import Decision from '../../components/identification/separator/Decision';
import LinkAtTheMenu from '../../components/identification/link-at-the-menu/LinkAtTheMenu';
import BackButton from '../../components/back-button/BackButton';

function LoginMenu() {
    const navigate = useNavigate();
    const handlers = useSwipeable({
        onSwipedRight: () => navigate('/Home'),
        trackMouse: true, 
    });

    return (
        <div {...handlers}>
            <Header />
            <BackButton/>
            <LocationRestaurant />
            <Decision />
            <LinkAtTheMenu />
        </div>
    );
}

export default LoginMenu;