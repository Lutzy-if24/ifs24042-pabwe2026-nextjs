import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/states/reducer";
import usersReducer from "@/features/users/states/reducer";
import postsReducer from "@/features/posts/states/reducer";

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      posts: postsReducer,
    },
    preloadedState,
  });
}

type ExtendedOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: Record<string, unknown>;
  store?: ReturnType<typeof createTestStore>;
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
