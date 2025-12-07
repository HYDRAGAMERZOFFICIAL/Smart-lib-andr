export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <div className={`flex items-center ${className}`} {...props}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <path d="M7 8h1v8H7V8zm2 0h1v8H9V8zm2 0h1v8h-1V8zm2 0h1v8h-1V8zm2 0h1v8h-1V8z" opacity="0.3" />
                </svg>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">Smart Library</span>
        </div>
    );
}
