
import React from 'react';
import { PhotoIcon } from './icons/PhotoIcon';

interface OutputSectionProps {
    generatedImage: string | null;
    isLoading: boolean;
    error: string | null;
}

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 border-2 border-dashed border-slate-600 rounded-lg bg-slate-800/50">
        <PhotoIcon className="w-16 h-16 text-slate-500 mb-4" />
        <h3 className="text-lg font-medium text-white">Your thumbnail will appear here</h3>
        <p className="text-sm text-slate-400 mt-1">Fill out the details on the left and click "Generate Thumbnail".</p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 border-2 border-dashed border-slate-600 rounded-lg bg-slate-800/50">
        <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-700 rounded-lg mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-48 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-64"></div>
        </div>
        <p className="text-sm text-slate-400 mt-4">Compositing your thumbnail... this may take a moment.</p>
    </div>
);


export const OutputSection: React.FC<OutputSectionProps> = ({ generatedImage, isLoading, error }) => {
    return (
        <div className="aspect-video w-full flex items-center justify-center bg-slate-900 rounded-lg lg:sticky lg:top-28">
            {isLoading && <LoadingState />}
            {error && !isLoading && (
                 <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 border-2 border-dashed border-red-500/50 rounded-lg bg-red-900/20">
                     <h3 className="text-lg font-medium text-red-300">Generation Failed</h3>
                     <p className="text-sm text-red-400 mt-2 max-w-md">{error}</p>
                 </div>
            )}
            {!isLoading && !error && generatedImage && (
                <img 
                    src={generatedImage} 
                    alt="Generated YouTube Thumbnail" 
                    className="w-full h-full object-contain rounded-lg shadow-2xl shadow-blue-500/10"
                />
            )}
             {!isLoading && !error && !generatedImage && <Placeholder />}
        </div>
    );
};
