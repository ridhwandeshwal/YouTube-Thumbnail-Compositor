
import React from 'react';
import type { ThumbnailFormData, VideoCategory } from '../types';
import { videoCategories } from '../types';
import { ImageUploader } from './ImageUploader';

interface InputSectionProps {
    formData: ThumbnailFormData;
    onFormChange: <K extends keyof ThumbnailFormData>(field: K, value: ThumbnailFormData[K]) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const InputField: React.FC<{ label: string; id: keyof ThumbnailFormData; value: string; onChange: (id: keyof ThumbnailFormData, value: string) => void; placeholder: string; required?: boolean }> = ({ label, id, value, onChange, placeholder, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);

const TextareaField: React.FC<{ label: string; id: keyof ThumbnailFormData; value: string; onChange: (id: keyof ThumbnailFormData, value: string) => void; placeholder: string; rows?: number }> = ({ label, id, value, onChange, placeholder, rows = 3 }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);

export const InputSection: React.FC<InputSectionProps> = ({ formData, onFormChange, onSubmit, isLoading }) => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-6">
            <h2 className="text-xl font-semibold text-white">Thumbnail Details</h2>
            
            <TextareaField
                label="Main Prompt"
                id="textPrompt"
                value={formData.textPrompt}
                onChange={onFormChange}
                placeholder="e.g., A shocked gamer reacting to a giant explosion"
                rows={4}
            />

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Video Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => onFormChange('category', e.target.value as VideoCategory)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {videoCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <ImageUploader 
                id="faceRefs"
                label="Face References (Optional)"
                files={formData.faceRefs}
                onFilesChange={(files) => onFormChange('faceRefs', files)}
            />

            <ImageUploader
                id="bgRefs"
                label="Background References (Optional)"
                files={formData.bgRefs}
                onFilesChange={(files) => onFormChange('bgRefs', files)}
            />

            <TextareaField
                label="Style Preferences (Optional)"
                id="stylePrefs"
                value={formData.stylePrefs}
                onChange={onFormChange}
                placeholder="e.g., MrBeast-style, bright yellow and teal, cinematic"
            />
            
            <InputField
                label="Title Text on Thumbnail (Optional)"
                id="titleText"
                value={formData.titleText}
                onChange={onFormChange}
                placeholder="e.g., I WON $1,000,000!"
            />

            <TextareaField
                label="Brand Preferences (Optional)"
                id="brandPrefs"
                value={formData.brandPrefs}
                onChange={onFormChange}
                placeholder="e.g., Use #FF0000 for text. Keep top right 112x112px clear for logo."
            />

            <button
                onClick={onSubmit}
                disabled={isLoading || !formData.textPrompt}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : 'Generate Thumbnail'}
            </button>
        </div>
    );
};
