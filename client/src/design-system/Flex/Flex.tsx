import React from 'react';
import styled from 'styled-components';

interface OwnProps {
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'stretch';
  children?: React.ReactNode;
  className?: string;
  css?: string;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  // TODO: Explore why we need to pass handlers down to React.FC -> styled
  // components instead of declaring it directly during consumption and
  // having it work as intended
  onClick?: Function;
  forwardRef?: React.RefObject<any>;
}

type FlexProps = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export const Flex: React.FC<FlexProps> = ({
  children,
  css,
  className,
  onClick,
  forwardRef,
  ...props
}) => {
  return (
    <FlexContainer
      className={className}
      css={css}
      onClick={onClick}
      ref={forwardRef}
      {...props}
    >
      {children}
    </FlexContainer>
  );
};

const FlexContainer = styled.div<FlexProps>`
  display: flex;
  position: relative;
  align-content: ${({ alignContent = 'stretch' }) => alignContent};
  align-items: ${({ alignItems = 'flex-start' }) => alignItems};
  flex-direction: ${({ flexDirection = 'row' }) => flexDirection};
  justify-content: ${({ justifyContent = 'flex-start' }) => justifyContent};
`;
