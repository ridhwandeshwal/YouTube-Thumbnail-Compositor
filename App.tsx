
import React, { useState, useCallback } from 'react';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { generateThumbnail } from './services/geminiService';
import type { ThumbnailFormData, VideoCategory } from './types';
import { videoCategories } from './types';

const App: React.FC = () => {
    const [formData, setFormData] = useState<ThumbnailFormData>({
        textPrompt: '',
        category: videoCategories[0],
        faceRefs: [],
        bgRefs: [],
        stylePrefs: '',
        brandPrefs: '',
        titleText: '',
    });

    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormChange = useCallback(<K extends keyof ThumbnailFormData,>(field: K, value: ThumbnailFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = async () => {
        if (!formData.textPrompt.trim()) {
            setError('The main text prompt is required.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const imageUrl = await generateThumbnail(formData);
            setGeneratedImage(imageUrl);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans">
            <header className="py-4 px-8 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    AI YouTube Thumbnail Compositor
                </h1>
                <p className="text-sm text-slate-400">Generate striking, CTR-optimized thumbnails in seconds.</p>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <InputSection 
                        formData={formData} 
                        onFormChange={handleFormChange}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                    <OutputSection
                        generatedImage={generatedImage}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
