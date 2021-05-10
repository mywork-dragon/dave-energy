import React from 'react';
import { Redirect, RouteProps, Route } from 'react-router';

const hasCookie = (name: string): string | null => {
  const cookieMap: Record<string, string> = document.cookie
    .split(';')
    .reduce((current, value: string) => {
      const equalsCharIndex = value.indexOf('=');
      const cookieName = value.substring(0, equalsCharIndex).trim();
      const cookieValue = value
        .substring(equalsCharIndex + 1, value.length)
        .trim();
      current[cookieName] = cookieValue;
      return current;
    }, {} as Record<string, string>);
  return cookieMap[name] ?? null;
};

// TODO: Account for specific user role privileges. For example, a building
// engineer shouldn't be able to access /entity. That is reserved for sudo (us)
export const SessionRoute: React.FC<RouteProps> = ({ path, component }) => {
  if (hasCookie('session')) {
    return <Route path={path} component={component} />;
  } else {
    return <Redirect to={'/login'} />;
  }
};
