// src/components/logout-button/LogoutButton.tsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, makeStyles, tokens, mergeClasses } from '@fluentui/react-components';
import { AuthContext } from '../../../services/AuthContext';


const useStyles = makeStyles({
  logoutButton: {
    right: tokens.spacingHorizontalM,
    backgroundColor: '#48ACAB',
    color: 'white',
    borderRadius: tokens.borderRadiusMedium,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: tokens.shadow4,
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#3A8C8A',
      transform: 'scale(1.05)',
    },
    zIndex: 1000,
  },
});

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const styles = useStyles();

  const handleLogout = () => {
    logout();
    navigate('/Login-Screen', { replace: true });
  };

  return (
    <Button
      className={styles.logoutButton}
      appearance="subtle"
      onClick={handleLogout}
      aria-label="Logout"
      data-testid="logout-button-test"
    >
      Logout
    </Button>
  );
}
