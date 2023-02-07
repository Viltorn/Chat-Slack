import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './components/App';
import LoginForm from './components/LoginForm.jsx';
import ErrorPage from './components/error-page.jsx';
import resources from './locales/index.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
]);

const init = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  return (
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  );
};

export default init;
