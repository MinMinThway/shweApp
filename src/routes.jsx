import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { BASE_URL } from './config/constant';
import { path } from 'd3';

const SignIn = lazy(() => import('./views/auth/signin/SignIn1'));
const SignUp = lazy(() => import('./views/auth/signup/SignUp1'));
const Dashboard = lazy(() => import('./views/dashboard'));
const Users = lazy(() => import('./views/users/Users'));
const News = lazy(() => import('./views/news/News'));
const Artical = lazy(() => import('./views/artical/Artical'));
const Service = lazy(() => import('./views/service/Service'));
const Exchange = lazy(() => import('./views/exchange/Exchange'));
const CallCenterAgentList = lazy(() => import('./views/agents/CallCenterAgentList'));
const BasicButton = lazy(() => import('./views/ui-elements/basic/BasicButton'));
const BasicBadges = lazy(() => import('./views/ui-elements/basic/BasicBadges'));
const BasicBreadcrumb = lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'));
const BasicCollapse = lazy(() => import('./views/ui-elements/basic/BasicCollapse'));
const BasicTabsPills = lazy(() => import('./views/ui-elements/basic/BasicTabsPills'));
const BasicTypography = lazy(() => import('./views/ui-elements/basic/BasicTypography'));
const FormsElements = lazy(() => import('./views/forms/FormsElements'));
const BootstrapTable = lazy(() => import('./views/tables/BootstrapTable'));
const NVD3Chart = lazy(() => import('./views/charts/nvd3-chart'));
const GoogleMaps = lazy(() => import('./views/maps/GoogleMaps'));
const SamplePage = lazy(() => import('./views/extra/SamplePage'));
const logout = lazy(()=> import('./views/logout'));

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    path: '/login',
    element: SignIn
  },
  {
    path: '/auth/signin-1',
    element: SignIn
  },
  {
    path: '/auth/signup-1',
    element: SignUp
  },
  {
    path: '*',
    layout: AdminLayout,
    guard: ProtectedRoute,
    routes: [
      { path: '/app/dashboard/default', element: Dashboard },
      { path: '/app/dashboard/users', element: Users },
      { path: '/app/dashboard/news', element: News },
      { path: '/app/dashboard/artical', element: Artical },
      { path: '/app/dashboard/service', element: Service },
      { path: '/app/dashboard/exchange', element: Exchange },
      { path: '/app/dashboard/call-center-agents', element: CallCenterAgentList },
      { path: '/basic/button', element: BasicButton },
      { path: '/basic/badges', element: BasicBadges },
      { path: '/basic/breadcrumb-paging', element: BasicBreadcrumb },
      { path: '/basic/collapse', element: BasicCollapse },
      { path: '/basic/tabs-pills', element: BasicTabsPills },
      { path: '/basic/typography', element: BasicTypography },
      { path: '/forms/form-basic', element: FormsElements },
      { path: '/tables/bootstrap', element: BootstrapTable },
      { path: '/charts/nvd3', element: NVD3Chart },
      { path: '/maps/google-map', element: GoogleMaps },
      { path: '/sample-page', element: SamplePage },
      {path :'/app/dashboard/logout', element : logout},
      { path: '*', element: () => <Navigate to={BASE_URL} /> }
    ]
  }
];

export default routes;
