import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import {
  QuestionCircleFilled,
  ChevronRightRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalXL,
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: tokens.spacingVerticalL,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: 500,
    cursor: 'pointer',
    padding: '12px 20px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',

    ':hover': {
      backgroundColor: '#ffffff',
      color: '#181616',
      transform: 'scale(0.68)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    },
  },

  // Responsive text
  '@media (max-width: 480px)': {
    heading: {
      fontSize: '1.4rem',
    },
    link: {
      fontSize: '1.1rem',
      padding: '10px 16px',
    },
  },
});

function LinkAtTheMenu() {
  const navigate = useNavigate();
  const styles = useStyles();

  const goToHelp = () => {
    window.open('/help/html/Introduccion.html', '_blank');
  };

  return (
    <div className={styles.container}>
      <Text className={styles.heading}>Or maybe just take a look</Text>

      <Text className={styles.link} onClick={() => navigate('/Main-Menu')}>
        <ChevronRightRegular fontSize={20} />
        At the menu
      </Text>

      <Text className={styles.link} onClick={goToHelp}>
        <QuestionCircleFilled fontSize={20} />
        Need some help?
      </Text>
    </div>
  );
}

export default LinkAtTheMenu;
