import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { useState } from 'react';
import Header from "../../components/headers-components/header/Header";
import NigiriBase from "../../components/nigiri-model/NigiriBase";

function Nigiri1() {
  const navigate = useNavigate();
  const [disliked2] = useState(() => JSON.parse(localStorage.getItem('nigiri2Disliked') || 'false'));
  const [disliked3] = useState(() => JSON.parse(localStorage.getItem('nigiri3Disliked') || 'false'));
  const [disliked4] = useState(() => JSON.parse(localStorage.getItem('nigiri4Disliked') || 'false'));
  const [disliked5] = useState(() => JSON.parse(localStorage.getItem('nigiri5Disliked') || 'false'));
  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (!disliked2) {
        navigate('/Nigiri2');
      } else if (!disliked3) {
        navigate('/Nigiri3');
      } else if (!disliked4) {
        navigate('/Nigiri4');
      } else if (!disliked5) {
        navigate('/Nigiri5');
      }
    },
    onSwipedDown: () => navigate('/Nigiri5'),
    onSwipedRight: () => navigate('/Main-Menu'),
    trackMouse: true,
  });

  return (
    <div {...handlers}>
      <Header />
      <NigiriBase
        id="nigiri1"
        name="Tai Nigiri"
        price={2.50}
        image="/nigiri1tai.png"
        description="1 unit per serving"
        ingredients="Mucho arroz y poco pescado"
        allergens="Seafood"
      />
    </div>
  );
}

export default Nigiri1;