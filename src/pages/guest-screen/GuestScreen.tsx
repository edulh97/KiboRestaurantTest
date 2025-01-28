import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import GuestOrderForm from "../../components/identification/guest-order-form/GuestOrderForm";
import Header from "../../components/headers-components/header/Header";
import Subtitle from "../../components/headers-components/subtitle-guest/Subtitle";
import BackButton from '../../components/back-button/BackButton';

function GuestScreen(){
    const navigate = useNavigate();
    const handlers = useSwipeable({
        
        onSwipedRight: () => navigate('/Login-Menu'),
        trackMouse: true,
    });

    return(
        <div {...handlers}>
        <Header/>
        <BackButton/>
        <Subtitle/>
        <GuestOrderForm/>
        </div>
    )
}

export default GuestScreen;