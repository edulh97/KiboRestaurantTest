import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { useState } from 'react';
import Header from "../../components/headers-components/header/Header";
import NigiriBase from "../../components/nigiri-model/NigiriBase";

function Nigiri3() {
    const navigate = useNavigate();
    const [disliked2] = useState(() => JSON.parse(localStorage.getItem('nigiri2Disliked') || 'false'));
    const [disliked4] = useState(() => JSON.parse(localStorage.getItem('nigiri4Disliked') || 'false'));
    const [disliked5] = useState(() => JSON.parse(localStorage.getItem('nigiri5Disliked') || 'false'));

    const handlers = useSwipeable({
        onSwipedUp: () => {
            if (!disliked4) {
                navigate('/Nigiri4');
            } else if (!disliked5) {
                navigate('/Nigiri5');
            }
        },
        onSwipedDown: () => {
            if (!disliked2) {
                navigate('/Nigiri2');
            } else {
                navigate('/Nigiri1');
            }
        },
        onSwipedRight: () => navigate('/Main-Menu'),
        trackMouse: true,
    });

    return (
        <div {...handlers}>
            <Header />
            <NigiriBase
                id="nigiri3"
                name="Salmon Nigiri"
                price={3.20}
                image="/nigiri3salmon.png"
                description="1 unit per serving"
                ingredients="Mucho arroz y poco pescado"
                allergens="Seafood"
            />
        </div>
    );
}

export default Nigiri3;

