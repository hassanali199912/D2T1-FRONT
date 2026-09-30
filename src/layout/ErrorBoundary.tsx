import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

function ErrorView({ message }: { message?: string }) {
    return (
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
            <Typography variant="h2">Something went wrong</Typography>
            {message ? <Typography color="text.secondary">{message}</Typography> : null}
        </Box>
    )
}

type ErrorBoundaryProps = {
    children?: ReactNode
}

type ErrorBoundaryState = {
    hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(error, info)
    }

    render() {
        if (this.state.hasError) return <ErrorView />
        return this.props.children
    }
}

export function RouteErrorBoundary() {
    const error = useRouteError()
    const message = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : error instanceof Error
          ? error.message
          : undefined

    return <ErrorView message={message} />
}
