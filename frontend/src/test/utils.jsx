// Test helpers: render components with the real reducers, router and modal
// context, and fake the backend with a small fetch router.
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { vi } from "vitest";
import sessionReducer from "../store/session";
import { spotReducer } from "../store/spotReducer";
import { reviewReducer } from "../store/reviewReducer";
import { ModalProvider, Modal } from "../context/Modal";

export const DEMO_USER = {
  id: 1, firstName: "Demo", lastName: "User", email: "demo@user.io", username: "Demo-User",
};

export function makeStore(preloadedState) {
  const rootReducer = combineReducers({
    session: sessionReducer,
    spots: spotReducer,
    reviews: reviewReducer,
  });
  return createStore(rootReducer, preloadedState, applyMiddleware(thunk));
}

// Render `ui` at `path` (matching `routePath`) with store, router and modals.
export function renderApp(ui, { user = null, path = "/", routePath = path } = {}) {
  const store = makeStore({ session: { user } });
  const result = render(
    <ModalProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <Modal />
          <Routes>
            <Route path={routePath} element={ui} />
            <Route path="*" element={<p>Other page</p>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </ModalProvider>
  );
  return { ...result, store };
}

// Fake backend: `routes` maps "METHOD /path" to [status, body] or a function
// returning one. Unknown requests fail the test loudly.
export function mockFetch(routes) {
  const calls = [];
  const fetchMock = vi.fn(async (url, options = {}) => {
    const method = (options.method || "GET").toUpperCase();
    const key = `${method} ${url}`;
    calls.push({ key, body: options.body ? JSON.parse(options.body) : undefined, headers: options.headers });
    const handler = routes[key];
    if (!handler) throw new Error(`Unexpected request: ${key}`);
    const [status, body] = typeof handler === "function" ? handler(options) : handler;
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  });
  vi.stubGlobal("fetch", fetchMock);
  window.fetch = fetchMock;
  return calls;
}
