import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { dep } from 'worona-deps';
import styled from 'react-emotion';

const labels = {
  'on-now': {
    id: 13,
    text: 'On Now',
    color: 'hotpink',
  },
  'up-next': {
    id: 15,
    text: 'Up Next',
    color: 'crimson',
  },
  schedule: {
    id: 17,
    text: 'Schedule',
    color: 'indigo',
  },
};

const NavItem = ({ label, isSelected, routeChangeRequested }) => (
  <Container isSelected={isSelected} label={label} onClick={routeChangeRequested}>
    {labels[label].text}
  </Container>
);

NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  routeChangeRequested: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, { label }) => ({
  routeChangeRequested: () =>
    dispatch(
      dep('connection', 'actions', 'routeChangeRequested')({
        selectedItem: { type: 'page', id: labels[label].id },
        method: 'push',
      }),
    ),
});

export default compose(
  connect(null, mapDispatchToProps),
  inject(({ connection }, { label }) => ({
    isSelected: connection.selectedContext.getItem({ item: { type: 'page', id: labels[label].id } })
      .isSelected,
  })),
)(NavItem);

const Container = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33%;
  background-color: ${({ isSelected, label }) => (isSelected ? labels[label].color : '')};
`;
