import React from 'react';
import Users from './components/Users';
import Roles from './components/Roles';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RBACNavbar from './components/Navbar';
import './App.css';
function App() {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <Users />,
    },
    {
      path: '/roles',
      element: <Roles />,
    },
  ]);
  return (
    <div>
      <RBACNavbar />
      <div className="height-100 bg-light">
        <RouterProvider router={appRouter} />
      </div>
    </div>
    
  );
}

export default App;
