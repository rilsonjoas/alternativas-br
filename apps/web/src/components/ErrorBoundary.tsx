import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error em React ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center border-destructive/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-destructive">
                Ops! Algo deu errado.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ocorreu uma falha inesperada durante a exibição desta página. Nossa equipe já pode investigar.
              </p>
              <Button onClick={this.handleReset} variant="default" className="w-full">
                Recarregar Página
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
