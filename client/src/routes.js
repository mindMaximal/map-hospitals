import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {MapPage} from "./pages/MapPage"
import {ViewPage} from "./pages/ViewPage"
import {DetailPage} from "./pages/DetailPage"
import {EditPage} from "./pages/EditPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
              {/*Добавить руты для авторизованного пользователя*/}
            </Switch>
        )
    }

    return (
        <Switch>
          <Route path="/detail/:id">
            <DetailPage />
          </Route>
          <Route path="/detail/">
            <Redirect to="/view" />
          </Route>

          <Route path="/edit/:id">
            <EditPage />
          </Route>
          <Route path="/edit/">
            <Redirect to="/view" />
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