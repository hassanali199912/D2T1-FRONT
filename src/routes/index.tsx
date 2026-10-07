import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout.tsx'
import ErrorBoundary, { RouteErrorBoundary } from '../layout/ErrorBoundary.tsx'
import Loader from '../layout/Loader.tsx'
import { paths } from './paths.ts'

const DashboardPage = lazy(() => import('../feature/pages/DashboardPage.tsx'))
const DocumentsPage = lazy(() => import('../feature/pages/DocumentsPage.tsx'))
const AskPage = lazy(() => import('../feature/pages/AskPage.tsx'))
const ClaimsPage = lazy(() => import('../feature/pages/ClaimsPage.tsx'))
const NewClaimPage = lazy(() => import('../feature/pages/NewClaimPage.tsx'))
const ApprovalsPage = lazy(() => import('../feature/pages/ApprovalsPage.tsx'))
const ApprovalReviewPage = lazy(() => import('../feature/pages/ApprovalReviewPage.tsx'))
const LoginPage = lazy(() => import('../feature/pages/LoginPage.tsx'))

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
                    { index: true, element: <Navigate to={paths.dashboard} replace /> },
                    { path: paths.dashboard, element: <DashboardPage /> },
                    { path: paths.documents, element: <DocumentsPage /> },
                    { path: paths.askAnswers, element: <AskPage /> },
                    { path: paths.claims, element: <ClaimsPage /> },
                    { path: paths.claimNew, element: <NewClaimPage /> },
                    { path: paths.approvals, element: <ApprovalsPage /> },
                    { path: `${paths.approvals}/:id`, element: <ApprovalReviewPage /> },
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
