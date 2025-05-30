import { HomePage } from '../pages/home/home-page';
import { AddPage } from '../pages/add/add-page';
import { DetailPage } from '../pages/detail/detail-page';
import { LoginPage } from '../pages/auth/login/login-page';
import { RegisterPage } from '../pages/auth/register/register-page';
import AboutPage from '../pages/about/about-page';

export const routes = {
  '/': () => new HomePage(),
  '/add': () => new AddPage(),
  '/login': () => new LoginPage(),
  '/register': () => new RegisterPage(),
  '/about': () => new AboutPage(),
  '/detail/:id': () => new DetailPage(), // jangan hapus
};
