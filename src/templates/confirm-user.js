import React from 'react';

import Wrapper from '../components/wrapper.style';
import Placeholder from "../components/placeholder.style";

const ConfirmUser = () => (
  <Wrapper>
    <h1>Confirm User</h1>
    <p>
      Please <Placeholder name={'username'}/> confirm your registration.
    </p>
  </Wrapper>
);

export default ConfirmUser;
