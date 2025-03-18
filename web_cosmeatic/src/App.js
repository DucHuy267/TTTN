import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './routes';
import HomePageHeader from './components/HeaderComponents/HomePageHeader';
import ChatWidget from './pages/ChatBot/ChatWidget';
import Footer from './components/FooterCompoments/Footer';

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div style={{ padding: '10px'}}>
      <>
        <a href="/" style={{color:'#a7a7a7'}}>Home</a>
      </>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        return (
          <span key={name}>
            <span style={{color:'#a7a7a7'}} >{ ' > '} </span>
            <a href={routeTo} style={{color:'#a7a7a7'}}>{name}</a>
          </span>
        );
      })}
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname) || {};

  return (
    <Fragment>
      {currentRoute.showHeader !== false && <HomePageHeader />}
      {currentRoute.showHeader !== false && location.pathname !== '/' && <Breadcrumb />}
      <Routes>
        {routes.map((route) => {
          const Page = route.page;
          return (
            <Route key={route.path} path={route.path} element={<Page />} />
          );
        })}
      </Routes>
    </Fragment>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ChatWidget />
      {/* import file đó vô đây  */}
      <Footer/>
    </Router>
  );
}

export default App;

