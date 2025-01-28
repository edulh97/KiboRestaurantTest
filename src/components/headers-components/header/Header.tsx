import React from "react";
import './Header.css'

const Header: React.FC = () => {
    return (
        <header className="header" data-testid="headerid">
            <h1>Kibō</h1>
        </header>
    );
};

export default Header;