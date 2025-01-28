// Nigiri4.tsx
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { useState } from 'react';
import Header from "../../components/headers-components/header/Header";
import NigiriBase from "../../components/nigiri-model/NigiriBase";

function Nigiri4() {
    const navigate = useNavigate();
    const [disliked2] = useState(() => JSON.parse(localStorage.getItem('nigiri2Disliked') || 'false'));
    const [disliked3] = useState(() => JSON.parse(localStorage.getItem('nigiri3Disliked') || 'false'));
    const [disliked5] = useState(() => JSON.parse(localStorage.getItem('nigiri5Disliked') || 'false'));
    const handlers = useSwipeable({
        onSwipedUp: () => {
            if (!disliked5) {
                navigate('/Nigiri5');
            }
        },
        onSwipedDown: () => {
            if (disliked2 && disliked3) {
                navigate('/Nigiri1');
            } else if (!disliked3) {
                navigate('/Nigiri3');
            } else {
                navigate('/Nigiri2');
            }
        },
        onSwipedRight: () => navigate('/Main-Menu'),
        trackMouse: true,
    });

    return (
        <div {...handlers}>
            <Header />
            <NigiriBase
                id="nigiri4"
                name="Tuna Nigiri"
                price={3.20}
                image="/nigiri4tuna.png"
                description="1 unit per serving"
                ingredients="Mucho arroz y poco pescado"
                allergens="Seafood"
            />
        </div>
    );
}

export default Nigiri4;



