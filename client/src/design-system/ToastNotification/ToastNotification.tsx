import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from 'store';
import { HIDE_TOAST_NOTIFICATION } from 'store/toastNotification';
import { colors, IconWarning } from 'design-system';

export const ToastNotification = () => {
  const dispatch = useDispatch();
  const isShown = useSelector(
    (state: RootState) => state.toastNotification.isShown,
  );

  if (isShown) {
    setTimeout(() => dispatch({ type: HIDE_TOAST_NOTIFICATION }), 6000);
  }

  return (
    <ToastNotificationContainer isShown={isShown}>
      <IconWarning
        css="margin-right: 13.5px; bottom: 21px;"
        color={colors.white}
      />
      <ToastMessage>
        We were not able to service your request.{'\n'}Our team is looking into
        the issue. Meanwhile, feel free to reach out to
        <a href="mailto:support@davidenergy.com">support@davidenergy.com</a>
      </ToastMessage>
      <CloseToast onClick={() => dispatch({ type: HIDE_TOAST_NOTIFICATION })} />
    </ToastNotificationContainer>
  );
};

const ToastNotificationContainer = styled.div<{ isShown: boolean }>`
  transition: all 400ms;
  position: fixed;
  height: 72px;
  width: 899px;
  z-index: 1;
  padding: 15px 18px;
  background: ${colors.error};
  font-family: Soleil;
  font-weight: 500;
  color: ${colors.white};
  box-shadow: 0 20px 50px 0 rgba(87, 94, 104, 0.2);
  border-radius: 4px;
  font-size: 16px;
  bottom: ${({ isShown }) => (isShown ? 55 : -100)}px;
  left: 40px;
`;

const ToastMessage = styled.span`
  white-space: pre-wrap;
  display: inline-block;
  line-height: 24px;
  position: relative;
  bottom: 3px;

  a {
    color: ${colors.white};
    border-bottom: 1px solid ${colors.white};
    margin-left: 5px;
  }
`;

const CloseToast = styled.span`
  :before {
    content: 'Close';
    margin-right: 8px;
  }

  position: absolute;
  cursor: pointer;
  padding: 8px;
  font-weight: 600;
  right: 8px;
  bottom: 6px;

  :after {
    content: 'x';
    font-size: 14px;
    bottom: 1px;
    position: relative;
  }
`;
