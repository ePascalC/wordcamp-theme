import React from 'react';
import styled from 'react-emotion';
import NavItem from './NavItem';

const labels = ['on-now', 'up-next', 'schedule'];

const Nav = () => (
  <Container>
    {labels.map(label => <NavItem key={label} label={label} />)}
    <MenuButton>Menu</MenuButton>
  </Container>
);

export default Nav;

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: ${({ theme }) => theme.sizes.button};
  background: orange;
  display: flex;
`;

const MenuButton = styled.div`
  width: ${({ theme }) => theme.sizes.button};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
