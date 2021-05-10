import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { registerUser } from 'store/user';

interface FormData {
  email: string;
  password: string;
}

export const RegisterPage: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const dispatch = useDispatch();
  const history = useHistory();
  const apiError = useSelector((state: any) => state.user.error);

  const onSubmit = (data: FormData) => {
    dispatch(registerUser(data, history));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        name="email"
        placeholder="Email"
        ref={register({ required: true })}
      />
      {errors.email && <p> Email is required </p>}
      {apiError && <p> apiError </p>}

      <input
        type="password"
        name="password"
        placeholder="Password"
        ref={register({ required: true })}
      />
      {errors.password && <p> Password is required </p>}

      <input type="submit" />
    </form>
  );
};
