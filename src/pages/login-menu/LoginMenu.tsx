import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import * as React from 'react';

import Header from '../../components/headers-components/header/Header';
import LocationRestaurant from '../../components/restaurant-info/location-restaurant/LocationRestaurant';
import Decision from '../../components/identification/separator/Decision';
import LinkAtTheMenu from '../../components/identification/link-at-the-menu/LinkAtTheMenu';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalXL),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: ' 20px',
    overflowY: 'auto',
    

    // Ocultar la scrollbar
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE 10+
    '&::-webkit-scrollbar': {
      display: 'none', // Chrome, Safari, Opera
    },
  },
});


const LoginMenu: React.FC = () => {
  const navigate = useNavigate();
  const styles = useStyles();

  const handlers = useSwipeable({
    onSwipedRight: () => navigate('/Home'),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <div {...handlers} className={styles.root}>
      <div className={styles.header}>
        <Header />
      </div>

      <div className={styles.content}>
        <LocationRestaurant />
        <Decision />
        <LinkAtTheMenu />
      </div>
    </div>
  );
};

export default LoginMenu;
