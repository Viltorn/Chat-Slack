import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import React from 'react';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import { Provider as StoreProvider } from 'react-redux';
import store from './slices/index.js';
import App from './components/App';
import resources from './locales/index.js';
import { AuthProvider } from './contexts/authContext.js';

const rollbarConfig = {
  accessToken: 'b818379a2e194c97bb88955db99f4e28',
  environment: 'production',
};

const Init = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      resources,
      fallbackLng: 'ru',
    });

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <RollbarProvider config={rollbarConfig}>
          <ErrorBoundary>
            <StoreProvider store={store}>
              <div className="d-flex flex-column h-100">
                <App />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </div>
            </StoreProvider>
          </ErrorBoundary>
        </RollbarProvider>
      </AuthProvider>
    </I18nextProvider>
  );
};

export default Init;
