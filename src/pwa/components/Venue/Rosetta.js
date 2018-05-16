import React from 'react';
import styled from 'react-emotion';

const Rosetta = () => <Container>Rosetta</Container>;

export default Rosetta;

const Container = styled.div`
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  padding: ${({ theme }) => theme.paddings.venue};
`;
