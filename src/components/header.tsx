import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGetTotalQuantity } from "../context/cart";
import { logOut, useGetUserEmail, useGetUserRole, useIsLoggedIn } from "../helpers/auth";
import { ProductCategory } from "../types";

const CATEGORIES = gql`
  query Categories {
    categories {
      id
      title
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout {
      error
      data
    }
  }
`;

export default function Header(props: any) {
  const [mounted, setMounted] = useState(false);
  const isLoggedIn: boolean = useIsLoggedIn();
  const [menuItems, setMenuItems] = useState([])
  const userEmail = useGetUserEmail();
  const cartTotal = useGetTotalQuantity()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const { data } = useQuery(CATEGORIES)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!data) {
      return
    }
    setMenuItems(data.categories)
  }, [data])

  const [logout, { error, data: logoutData }] = useMutation(LOGOUT, {
    onError(error){
      console.log(error)
    },
    onCompleted(data) {
      logOut()
    }
  });

  const handleLogOut = () => {
    setShowProfileDropdown(false)
    logout()
  }

  const MenuItems = () => {
    const userRole = useGetUserRole()
    if (userRole === 'admin') {
      return (
        <ul className="navbar-nav me-auto mb-2 mb-3 mb-lg-0">
          <li className="nav-item">
            <Link href={`/admin`}><a className="nav-link">Products</a></Link>
          </li>
          <li className="nav-item">
            <Link href={`/admin/categories`}><a className="nav-link">Categories</a></Link>
          </li>
          <li className="nav-item">
            <Link href={`/admin/users`}><a className="nav-link">Users</a></Link>
          </li>
          <li className="nav-item">
            <Link href={`/admin/orders`}><a className="nav-link">Orders</a></Link>
          </li>
        </ul>
      )
    }
    return (
      <ul className="navbar-nav me-auto mb-2 mb-3 mb-lg-0">
        {menuItems.map((item: ProductCategory) => (
          <li key={item.id} className="nav-item">
            <Link href={`/?category=${item.title}`}><a className="nav-link">{item.title}</a></Link>
          </li>
        ))}
      </ul>
    )
  }

  const AuthSection = () => {
    if (isLoggedIn && userEmail) {
      return (
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" onClick={() => setShowProfileDropdown(state => !state)} id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {userEmail}
          </a>
          <ul className={`dropdown-menu ${showProfileDropdown ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
            <li><a className="dropdown-item" role="button" onClick={handleLogOut}>Log out</a></li>
          </ul>
        </li>
      )
    }
    return (
      <>
        <li className="nav-item">
          <Link href="/login"><a className="nav-link">Log in</a></Link>
        </li>
        <li className="nav-item">
          <Link href="/register"><a className="nav-link">Register</a></Link>
        </li>
      </>
    )
  }

  return (
    <header className="mb-4">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link href="/"><a className="navbar-brand">Larbonne</a></Link>
          <button className="navbar-toggler" onClick={() => setShowMobileMenu(state => !state)} type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`} id="navbarText">
            {mounted && <MenuItems />}
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item mx-3">
                <Link href="/cart">
                  <a className="nav-link position-relative">
                    <i className="pi pi-shopping-cart"></i>
                    <span className="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartTotal}
                      <span className="visually-hidden">Number of items in cart</span>
                    </span>
                  </a>
                </Link>
              </li>
              {mounted && <AuthSection />}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
