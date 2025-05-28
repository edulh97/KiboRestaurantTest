// src/pages/LoginScreen.tsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { makeStyles, tokens } from '@fluentui/react-components';

import Header from '../../components/headers-components/header/Header';
import LoginOrderForm from '../../components/identification/login-order-form/LoginOrderForm';
import BackButton from '../../components/back-button/BackButton';
import { AuthContext } from '../../services/AuthContext';


const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
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


export default function LoginScreen() {
  const navigate = useNavigate();
  const styles = useStyles();
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  const handlers = useSwipeable({
    onSwipedRight: () => navigate('/Login-Menu'),
    trackMouse: true,
  });

  const handleSubmit = async (email: string, password: string) => {
    try {
      await loginUser(email, password);
      // <— aquí cambiamos la ruta a la que navegamos
      navigate('/Main-Menu');
    } catch (e: any) {
      setError(e.response?.data || 'Credenciales inválidas');
    }
  };

  return (
    <div {...handlers} className={styles.wrapper}>
      <div className={styles.content}>
        <Header />
        <BackButton />
        <LoginOrderForm onSubmit={handleSubmit} error={error} />
      </div>
    </div>
  );
}