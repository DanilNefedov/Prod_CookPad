'use client';

import { Component, ReactNode } from 'react';
import { ErrorPageContent } from './error';





export class ErrorBoundary extends Component<{children: ReactNode}, { hasError: boolean }> {
    
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
        this.resetError = this.resetError.bind(this);
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    resetError() {
        this.setState({ hasError: false });
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPageContent reset={this.resetError} />;
        }

        return this.props.children;
    }
}
