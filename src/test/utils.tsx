import { GoogleOAuthProvider } from '@react-oauth/google';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../shared/ui/Toast';
import appReducer from '@/app/slices/appSlice';
import authReducer from '@/app/slices/authSlice';
import chatReducer from '@/app/slices/chatSlice';

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
          <BrowserRouter>
            <ToastProvider>{children}</ToastProvider>
          </BrowserRouter>
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
