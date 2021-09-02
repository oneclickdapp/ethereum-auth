// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'
import UsersLayout from 'src/layouts/UsersLayout'
import DefaultLayout from 'src/layouts/DefaultLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={DefaultLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/login" page={LoginPage} name="login" />
        <Set private unauthenticated="login" wrap={UsersLayout}>
          <Route path="/users/{id}" page={UserUserPage} name="user" />
          <Route path="/users" page={UserUsersPage} name="users" />
        </Set>
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
