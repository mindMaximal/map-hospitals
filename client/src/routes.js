import React from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {AdminPage} from './pages/AdminPage'
import {MapPage} from "./pages/MapPage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/admin">
                    <AdminPage />
                </Route>
                <Route path="/detail/:id">
                    <MapPage />
                </Route>
                <Route path="/">
                  <MapPage />
                </Route>
              <Route path="/pdf">
                <Redirect to="/pdf"/>
              </Route>
                <Redirect to="/"/>
            </Switch>
        )
    }

    return (
        <Switch>
          <Route path="/admin">
            <AuthPage />
          </Route>
          <Route path="/">
            <MapPage />
          </Route>
          <Route path="/detail/:id">
            <MapPage />
          </Route>
          <Redirect to="/" />
        </Switch>
    )
}