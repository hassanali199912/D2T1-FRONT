import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout.tsx'
import ErrorBoundary, { RouteErrorBoundary } from '../layout/ErrorBoundary.tsx'
import Loader from '../layout/Loader.tsx'

const DashboardPage = lazy(() => import('../pages/DashboardPage.tsx'))
const LoginPage = lazy(() => import('../pages/LoginPage.tsx'))

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <RouteErrorBoundary />,
        element: (
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
        ),
        children: [
            {
                path: "/",
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: 'dashboard', element: <DashboardPage /> },
                ],
            },
            {
                path: 'login',
                element: (
                    <LoginPage />
                ),
            },
        ],
    },
])

export default function AppRoutes() {
    return (
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>

    )
}
