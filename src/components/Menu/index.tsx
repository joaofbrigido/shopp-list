import homeIcon from "../../imgs/iconHome.svg";
import registerIcon from "../../imgs/iconRegisterItem.svg";
import logoutIcon from "../../imgs/iconLogout.svg";
import "./styles.scss";
import { useState } from "react";

export const Menu = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [currentPage, setcurrentPage] = useState(document.location.pathname);

  function toggleMenu() {
    setMenuIsOpen(!menuIsOpen);
  }

  return (
    <>
      <button className="openMenu" onClick={toggleMenu}>
        Menu
        <div className="hamburger"></div>
      </button>

      <div className={menuIsOpen ? "menu active" : "menu"}>
        <button className="closeMenu" onClick={toggleMenu}>
          Menu X
        </button>

        <nav>
          <ul>
            <li className={currentPage === "/home" ? "active" : ""}>
              <a href="/home">
                <img src={homeIcon} alt="Home" />
                Home
              </a>
            </li>
            <li className={currentPage === "/cadastrar" ? "active" : ""}>
              <a href="/cadastrar">
                <img src={registerIcon} alt="Cadastrar" />
                Itens
              </a>
            </li>
            <li>
              <a href="/">
                <img src={logoutIcon} alt="Sair" />
                Sair
              </a>
            </li>
          </ul>
        </nav>

        <a href="/" className="credits">
          Feito por: João Fernando A. Brígido
        </a>
      </div>
    </>
  );
};
