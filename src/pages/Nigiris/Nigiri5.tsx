// Nigiri2.tsx
import Header from "../../components/headers-components/header/Header";
import NigiriBase from "../../components/nigiri-model/NigiriBase";
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
function Nigiri5() {
    const navigate = useNavigate();
    const handlers = useSwipeable({
        onSwipedDown: () => navigate('/Nigiri4'),
        onSwipedUp: () => navigate('/Nigiri1'),
        onSwipedRight: () => navigate('/Main-Menu'),
        trackMouse: true,
    });
    return (
        <div {...handlers}>
            <Header />
            <NigiriBase
                id="nigiri5"
                name="Beef Nigiri"
                price={4.90}
                image="/nigiri5beef.png"
                description="1 unit per serving"
                ingredients="Mucho arroz y poco pescado"
                allergens="Seafood"
            />
        </div>
    );
}

export default Nigiri5;
