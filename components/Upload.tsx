import { useState, useCallback } from "react";
import { useOutletContext } from "react-router";
import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import {
    PROGRESS_INTERVAL_MS,
    PROGRESS_STEP,
    REDIRECT_DELAY_MS,
} from "../lib/constants";

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

    // =========================
    // File Processing
    // =========================
    const processFile = useCallback(
        (selectedFile: File) => {
            if (!isSignedIn) return;

            if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
                 console.error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
                 return;
            }

            setFile(selectedFile);

            const reader = new FileReader();

            reader.onload = () => {
                const base64 = reader.result as string;

                let currentProgress = 0;

                const interval = setInterval(() => {
                    currentProgress += PROGRESS_STEP;
                    setProgress(currentProgress);

                    if (currentProgress >= 100) {
                        clearInterval(interval);

                        setTimeout(() => {
                            onComplete(base64);
                        }, REDIRECT_DELAY_MS);
                    }
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

    // =========================
    // Input Change
    // =========================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;

        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    // =========================
    // Drag Handlers
    // =========================
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isSignedIn) return;

        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) processFile(droppedFile);
    };

    return (
        <div className="upload">
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? "is-dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="drop-input"
                        accept=".jpg,.jpeg,.png"
                        disabled={!isSignedIn}
                        onChange={handleChange}
                    />

                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20} />
                        </div>

                        <p>
                            {isSignedIn
                                ? "Click to upload or drag and drop"
                                : "Sign in or sign up with puter to upload"}
                        </p>

                        <p className="help">Maximum file size 50MB.</p>
                    </div>
                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? (
                                <CheckCircle2 className="check" />
                            ) : (
                                <ImageIcon className="image" />
                            )}
                        </div>

                        <h3>{file.name}</h3>

                        <div className="progress">
                            <div
                                className="bar"
                                style={{ width: `${progress}%` }}
                            />

                            <p className="status-text">
                                {progress < 100
                                    ? "Analyzing floor plan..."
                                    : "Redirecting..."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;
