import React from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {AdminPage} from './pages/AdminPage'
import {MapPage} from "./pages/MapPage";
import {AuthPage} from "./pages/AuthPage";
import {ViewPage} from "./pages/ViewPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated || true) {
        return (
            <Switch>
                <Route path="/admin">
                    <AdminPage />
                </Route>
                <Route path="/detail/:id">
                    <MapPage />
                </Route>
                <Route path="/view">
                  <ViewPage />
                </Route>
                <Route path="/">
                  <MapPage />
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
          <Route path="/detail/:id">
            <MapPage />
          </Route>
          <Route path="/view">
            <ViewPage />
          </Route>
          <Route path="/">
            <MapPage />
          </Route>
          <Redirect to="/" />
        </Switch>
    )
}