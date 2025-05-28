// src/components/back-button/BackButton.tsx

import { useNavigate } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: '20px',
    left: '20px',
    width: '50px',
    height: '35px',
    backgroundColor: '#48ACAB',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '20px',
    cursor: 'pointer',
    zIndex: 1000,
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#48ACAB',
      transform: 'scale(1.05)',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0)',
    },
  },
});

type BackButtonProps = {
  to?: string; // Si se pasa, redirige a esa ruta
};

function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();
  const styles = useStyles();

  const handleClick = () => {
    if (to) {
      navigate(to, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <>

      <button
        className={styles.backButton}
        onClick={handleClick}
        aria-label="Go Back"
        data-testid="back-button-test"
      >
        ←
      </button>

    </>
  );
}

export default BackButton;
