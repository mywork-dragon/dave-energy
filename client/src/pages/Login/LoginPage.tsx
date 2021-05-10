import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { loginUser } from 'store/user';
import { OnboardingLayout } from 'components/Layouts';
import {
  Button,
  colors,
  Flex,
  Input,
  DavidEnergyLogoMark,
  IconWarning,
} from 'design-system';

interface FormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { register, handleSubmit, errors, formState } = useForm<FormData>({
    mode: 'onChange',
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const apiError = useSelector((state: any) => state.user.error);

  const onSubmit = (fields: FormData) => {
    dispatch(loginUser(fields, history));
  };

  return (
    <OnboardingLayout>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <DavidEnergyLogoMark css="margin-bottom: 24px;" color={colors.blue} />
        <Header>Log into David Energy</Header>
        <Input
          css={`
            margin-bottom: 10px;
          `}
          type="Header"
          name="email"
          placeholder="Email"
          isInvalid={errors.email ? true : false}
          forwardRef={register({ required: true })}
        />
        <Input
          css={`
            margin-bottom: 40px;
          `}
          type="password"
          name="password"
          placeholder="Password"
          forwardRef={register({ required: true })}
        />
        <Button
          css={`
            margin-bottom: 28px;
          `}
          disabled={!formState.isValid}
        >
          LOG IN
        </Button>
        {apiError && (
          <Flex alignItems="center">
            <IconWarning
              css={`
                margin-right: 10px;
              `}
            />
            <ErrorText>{JSON.stringify(apiError)}</ErrorText>
          </Flex>
        )}
      </Form>
    </OnboardingLayout>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 460px;
  height: 425px;
`;

const Header = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 15px;
  font-weight: 500;
  color: ${colors.blue};
  margin-bottom: 64px;
`;

const ErrorText = styled.span`
  font-family: Soleil;
  font-size: 13px;
  font-weight: 350;
  color: ${colors.error};
`;
