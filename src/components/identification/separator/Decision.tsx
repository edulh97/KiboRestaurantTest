import { Button, makeStyles } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    width: "100%",
    maxWidth: "600px",
    margin: "10px auto",
   

    // Forzar columna en móvil
    "@media screen and (max-width: 480px)": {
      flexDirection: "column",
      gap: "12px",
    },
  },
  separator: {
    height: "40px",
    width: "1px",
    backgroundColor: "#000",

    "@media screen and (max-width: 480px)": {
      display: "none",
    },
  },
  button1: {
    width: "250px",
    maxWidth: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    fontFamily: "'Jaro', sans-serif",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#181616",
    color: "white",
    transition: "background-color 0.3s ease, transform 0.2s",
    boxShadow: "-5px 5px 20px rgba(0, 0, 0, 0.6)",
    "&:hover": {
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.7)",
      transform: "scale(1.05)",
      color: "white",
    },
    "@media screen and (max-width: 480px)": {
      width: "300px",
    },
  },
  button2: {
    width: "250px",
    maxWidth: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    fontFamily: "'Jaro', sans-serif",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#48ACAB",
    color: "white",
    transition: "background-color 0.3s ease, transform 0.2s",
    boxShadow: "-5px 5px 20px rgba(0, 0, 0, 0.6)",
    "&:hover": {
      backgroundColor: "#39908F",
      transform: "scale(1.05)",
    },
    "@media screen and (max-width: 480px)": {
      width: "300px",
    },
  },
});

function Decision() {
  const navigate = useNavigate();
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Button
        className={styles.button1}
        onClick={() => navigate("/Login-Screen")}
      >
        Log in
      </Button>
      <div className={styles.separator}></div>
      <Button
        className={styles.button2}
        onClick={() => navigate("/Guest-Screen")}
      >
        Continue as guest
      </Button>
    </div>
  );
}

export default Decision;
