

# Fix: Route Group Components

React Router v6 requires all direct children of `<Routes>` to be `<Route>` or `<React.Fragment>`. `<ServiceRouteGroup />` and `<AdminRouteGroup />` are custom components returning fragments of routes, which isn't allowed.

## Fix

Replace `<ServiceRouteGroup />` and `<AdminRouteGroup />` calls on lines 190 and 221 with direct inline calls that spread the JSX fragment content:

- Change `ServiceRouteGroup` and `AdminRouteGroup` from arrow-function components to plain functions that return JSX
- Call them as `{ServiceRouteGroup()}` instead of `<ServiceRouteGroup />` so the fragment is inlined directly into the `<Routes>` tree

This is a two-character change per call site: `<ServiceRouteGroup />` → `{ServiceRouteGroup()}` and `<AdminRouteGroup />` → `{AdminRouteGroup()}`.

