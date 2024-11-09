import './App.css';
import { Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingCar from './pages/BookingCar';
import UserBookings from './pages/UserBookings';
import AddCar from './pages/AddCar';
import AdminHome from './pages/AdminHome';
import EditCar from './pages/EditCar';
import Gpay from './pages/GPayQRPage';

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  if (localStorage.getItem('user')) {
    // user is authenticated
    return children;
  }
  return <Navigate to="/login" />;
};

// Define Routes
const router = createBrowserRouter([
  { path: "/", element: <ProtectedRoute><Home/></ProtectedRoute> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { 
    path: "/booking/:carid", 
    element: <ProtectedRoute><BookingCar /></ProtectedRoute>,
    loader: ({ params }) => params.carid 
  },
  { path: "/userbookings", element: <ProtectedRoute><UserBookings/></ProtectedRoute> },
  { path: "/addcar", element: <ProtectedRoute><AddCar/></ProtectedRoute> },
  { 
    path: "/editcar/:carid", 
    element: <ProtectedRoute><EditCar/></ProtectedRoute>,
    loader: ({ params }) => params.carid 
  },
  { path: "/admin", element: <ProtectedRoute><AdminHome/></ProtectedRoute> },
  { path: "/gpay", element: <Gpay /> } // GPay route
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
