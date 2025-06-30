interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop with blur effect */}
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Modal container */}
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl relative border border-gray-100 overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-400 p-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h2>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full transition-all duration-200 shadow-lg flex items-center justify-center w-10 h-10 hover:scale-105"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 text-gray-700 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {children}
                </div>
                
                {/* Footer shadow effect */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
}