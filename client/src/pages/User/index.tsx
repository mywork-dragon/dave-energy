import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';

export const UserPage: React.FC = () => {
  const email = useSelector(({ user }: RootState) => user?.instance?.email);
  return (
    <div>
      <h1>{email}</h1>
    </div>
  );
};
