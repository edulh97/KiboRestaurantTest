import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import Card from '../../components/categories/Card';
import BackButton from '../../components/back-button/BackButton';
import LogoutButton from '../../components/identification/logout/LogoutButton';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '130px',
    paddingBottom: tokens.spacingVerticalXL,
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: tokens.colorNeutralBackground1,
    width: '100%',
    boxSizing: 'border-box',

    // Media query para pantallas pequeñas
    '@media (max-width: 768px)': {
      paddingTop: '100px',
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM,
    },
    '@media (max-width: 480px)': {
      paddingTop: '80px',
      paddingLeft: tokens.spacingHorizontalS,
      paddingRight: tokens.spacingHorizontalS,
    },
  },
});

function MainMenu() {
  const navigate = useNavigate();
  const styles = useStyles();

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate('/Nigiri1'),
    onSwipedRight: () => navigate('/Login-Menu'),
    trackMouse: true,
  });

  return (
    <div {...handlers} className={styles.wrapper}>
      <BackButton to="LoginLogin-Menu" />
      <Card />
      <LogoutButton />
    </div>
  );
}

export default MainMenu;
