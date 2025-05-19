import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { makeStyles, tokens } from '@fluentui/react-components';

import Header from '../../components/headers-components/header/Header';
import LoginOrderForm from '../../components/identification/login-order-form/LoginOrderForm';
import LoginSubtitle from '../../components/headers-components/subtitle-login/LoginSubtitle';
import BackButton from '../../components/back-button/BackButton';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',     // centra verticalmente
    alignItems: 'center',         // centra horizontalmente
    minHeight: '100vh',           // ocupa toda la altura de la pantalla
    padding: tokens.spacingHorizontalXXL,
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
    gap: tokens.spacingVerticalXL,
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalL,
    maxWidth: '500px',
    width: '100%',
  },
});

function LoginScreen() {
  const navigate = useNavigate();
  const styles = useStyles();

  const handlers = useSwipeable({
    onSwipedRight: () => navigate('/Login-Menu'),
    trackMouse: true,
  });

  return (
    <div {...handlers} className={styles.wrapper}>
      <div className={styles.content}>
        <Header />
        <BackButton />
        <LoginOrderForm />
      </div>
    </div>
  );
}

export default LoginScreen;
