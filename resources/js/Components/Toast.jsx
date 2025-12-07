import { Toaster } from 'react-hot-toast';

export default function Toast() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                success: {
                    style: {
                        background: '#10B981',
                        color: 'white',
                    },
                    iconTheme: {
                        primary: 'white',
                        secondary: '#10B981',
                    },
                    duration: 3000,
                },
                error: {
                    style: {
                        background: '#EF4444',
                        color: 'white',
                    },
                    iconTheme: {
                        primary: 'white',
                        secondary: '#EF4444',
                    },
                    duration: 3000,
                },
                loading: {
                    style: {
                        background: '#3B82F6',
                        color: 'white',
                    },
                },
            }}
        />
    );
}