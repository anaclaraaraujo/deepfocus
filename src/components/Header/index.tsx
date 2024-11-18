import { Scroll, Timer } from '@phosphor-icons/react';
import logo from '../../assets/logo.svg';
import { NavLink } from 'react-router-dom';
import { HeaderContainer } from './styles';

export function Header() {
  return (
    <HeaderContainer>
      <span>
        <img src={logo} alt="" />
      </span>

      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        
        <NavLink to="/history" title="Histórico">
          <Scroll size={24} />
        </NavLink>
      </nav>

    </HeaderContainer>
  )
}