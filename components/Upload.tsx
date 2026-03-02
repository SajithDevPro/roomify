import { useState, useCallback } from "react";
import { useOutletContext } from "react-router";
import { CheckCircle2, UploadIcon } from "lucide-react";
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from "../lib/constants";

type AuthContext = {
    isSignedIn: boolean;
    userName: string | null;
    userId: string | null;
    signIn: () => Promise<boolean>;
    signOut: () => Promise<boolean>;
};

type UploadProps = {
    onComplete: (base64: string) => void;
};

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const { isSignedIn } = useOutletContext<AuthContext>();

    const MAX_FILE_SIZE_MB = 50;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const processFile = useCallback(
        (selectedFile: File) => {
            if (!isSignedIn) return;

            if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
                console.error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
                return;
            }

            setFile(selectedFile);
            setProgress(0);

            const reader = new FileReader();

            reader.onload = () => {
                const base64 = reader.result as string;
                if (!base64) return;

                let currentProgress = 0;
                const interval = setInterval(() => {
                    currentProgress += PROGRESS_STEP;
                    if (currentProgress >= 100) {
                        currentProgress = 100;
                        clearInterval(interval);
                        setProgress(100);
                        setTimeout(() => onComplete(base64), REDIRECT_DELAY_MS);
                        return;
                    }
                    setProgress(currentProgress);
                }, PROGRESS_INTERVAL_MS);
            };

            reader.onerror = () => {
                setFile(null);
                setProgress(0);
                console.error("Failed to read file");
            };

            reader.readAsDataURL(selectedFile);
        },
        [isSignedIn, onComplete]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) processFile(droppedFile);
    };

    return (
        <div className="w-full">
            {!file ? (
                <div
                    className={`relative group h-64 rounded-2xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${isDragging
                        ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept=".jpg,.jpeg,.png,.webp"
                        disabled={!isSignedIn}
                        onChange={handleChange}
                    />
                    <div className="flex flex-col items-center pointer-events-none transition-transform duration-500 group-hover:scale-110">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${isDragging ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50" : "bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/10"
                        }`}>
                            <UploadIcon size={28} />
                        </div>
                        <p className="text-white font-semibold text-lg mb-2">
                            {isSignedIn
                                ? "Drop your floor plan here"
                                : "Sign in to start creating"}
                        </p>
                        <p className="text-white/40 text-sm">
                            {isSignedIn ? "or click to browse from files" : "Join Roomify to transform your spaces"}
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-xs text-white/20">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">JPG, PNG</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Up to 50MB</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-64 rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col justify-center relative overflow-hidden backdrop-blur-sm">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6 border border-white/10 shadow-xl">
                            {progress === 100 ? (
                                <CheckCircle2 className="w-8 h-8 text-green-400 animate-bounce" />
                            ) : (
                                <UploadIcon className="w-8 h-8 text-blue-400 animate-pulse" />
                            )}
                        </div>
                        <h3 className="text-white font-bold text-lg truncate max-w-full px-4 mb-4">
                            {file.name}
                        </h3>

                        <div className="w-full max-w-xs">
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3 border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                                {progress < 100 ? `Analyzing floor plan... ${progress}%` : "Success! Redirecting..."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;




