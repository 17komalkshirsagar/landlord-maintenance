import { ReactNode } from 'react';
import { Toaster } from 'sonner';

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            {children}
            <Toaster richColors position="top-right" />
        </>
    );
}
