import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Navbar from './components/navbar/Navbar'
import Homepage from './pages/homepage/Homepage'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Favoriler from './pages/favoriler/Favoriler'
import Sepet from './pages/sepet/Sepet'
import MagazaUser from './pages/magazaKullanıcı/MagazaUser'
import Detay from './pages/urunDetay/Detay'
import Category from './pages/category/Category'
import MagazaDetay from './pages/magazaDetay/MagazaDetay';

const App = () => {

  const router = createBrowserRouter([
    {
      path:"/",
      element: <Navbar/>,
      children:[
        {
          path:"/",
          element:<Homepage/>
        },
        {
          path:"login",
          element:<Login/>
        },
        {
          path:"register",
          element:<Register/>
        },
        {
          path:"favoriler",
          element:<Favoriler/>
        },
        {
          path:"sepet",
          element:<Sepet/>
        },
        {
          path:"magazaUser",
          element:<MagazaUser/>
        },
        {
          path:"detay/:id",
          element:<Detay/>
        },
        {
          path:"kategori/:slug",
          element:<Category/>
        },
        {
          path:"magazaDetay/:id",
          element:<MagazaDetay/>
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App