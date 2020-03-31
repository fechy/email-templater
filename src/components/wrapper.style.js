import React from 'react';
import styled from 'styled-components';

const WrapperDiv = styled.div`
  margin: 0 auto !important;
  max-width: 500px;
  text-align: center;
`;

const Wrapper = ({ children }) => (<WrapperDiv>{children}</WrapperDiv>);

export default Wrapper;
