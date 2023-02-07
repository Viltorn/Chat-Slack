import { useRouteError } from 'react-router-dom';
import errorImage from '../assets/not-found.svg';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="text-center" id="error-page">
      <img
        alt="Страница не найдена"
        className="img-fluid h-25"
        src={errorImage}
      />
      <h1 className="h4 text-muted">Страница не найдена</h1>
      <p className="text-muted">
        Но вы можете перейти
        <a href="/">на главную страницу</a>
      </p>
    </div>
  );
};

export default ErrorPage;
