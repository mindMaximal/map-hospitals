import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {MapPage} from "./pages/MapPage"
import {ViewPage} from "./pages/ViewPage"

export const useRoutes = isAuthenticated => {
    if (isAuthenticated || true) {
        return (
            <Switch>
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