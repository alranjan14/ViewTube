import { GoogleOAuthProvider } from '@react-oauth/google';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import appReducer from '../utils/appSlice';
import authReducer from '../utils/authSlice';
import chatReducer from '../utils/chatSlice';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const store = configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
      chat: chatReducer,
    },
  });
  const testQueryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <GoogleOAuthProvider clientId="test-client-id">
      <Provider store={store}>
        <QueryClientProvider client={testQueryClient}>
          <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </GoogleOAuthProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    store,
    testQueryClient,
  };
};
