import { useLocation, useNavigate, useOutletContext, useParams } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { generate3DView } from "../../lib/ai.action";
import { Box, Download, RefreshCcw, Share2, X } from "lucide-react";
import Button from "../../components/UI/Button";
import { createProject, getProjectById } from "../../lib/puter.action";

const Visualizer = () => {

    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {userId} = useOutletContext<AuthContext>();

    const [project, setProject] = useState<DesignItem | null>(null);
    const [isProjectLoading, setIsProjectLoading] = useState(true);
    const hasInitialGenerated = useRef(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stepIndex, setStepIndex] = useState(0);

    const steps = [
        "Analyzing blueprint",
        "Mapping walls",
        "Extruding structure",
        "Applying materials",
        "Rendering lighting"
    ];

    useEffect(() => {
        if (!isProcessing) return;
        const interval = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % steps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [isProcessing]);

    const handleBack = () => navigate("/");

    const runGeneration = useCallback(
        async (item: DesignItem) => {
            if (!id || !item.sourceImage) return;
            try {
                setIsProcessing(true);
                setError(null);

                const result = await generate3DView({sourceImage: item.sourceImage});

                if (!result?.renderedImage) {
                    setError("AI failed to generate 3D render.");
                    return;
                }

                setCurrentImage(result.renderedImage);

                const updatedItem = {
                    ...item,
                    renderedImage: result.renderedImage,
                    timestamp: Date.now(),
                    ownerId: item.ownerId ?? userId ?? null,
                };

                const saved = await createProject({item: updatedItem});

                if (saved) {
                    setProject(saved);
                }

            } catch (err) {
                console.error("Generation failed:", err);
                setError("Something went wrong during rendering.");
            } finally {
                setIsProcessing(false);
            }
        },
        [id, userId]
    );

    useEffect(() => {
        let isMounted = true;

        const loadProject = async () => {
            if (!id) {
                setIsProjectLoading(false);
                return;
            }

            setIsProjectLoading(true);
            const fetchedProject = await getProjectById({id});

            if (!isMounted) return;

            setProject(fetchedProject);
            setCurrentImage(fetchedProject?.renderedImage || null);
            setIsProjectLoading(false);
            hasInitialGenerated.current = false;
        };

        loadProject();
        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        if (isProjectLoading || hasInitialGenerated.current || !project?.sourceImage) return;

        if (project.renderedImage) {
            setCurrentImage(project.renderedImage);
            hasInitialGenerated.current = true;
            return;
        }

        hasInitialGenerated.current = true;
        void runGeneration(project);
    }, [project, isProjectLoading, runGeneration]);



    return (
        <div className="visualizer bg-zinc-950 min-h-screen text-white font-sans selection:bg-blue-500/30">

            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="topbar flex justify-between items-center px-6 py-3 backdrop-blur-xl bg-zinc-900/60 border border-white/10 shadow-2xl shadow-black/50 rounded-2xl">
                        <div className="brand flex items-center gap-3">
                            <div
                                className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20">
                                <Box className="logo text-white w-5 h-5"/>
                            </div>
                            <span className="name text-lg font-bold tracking-tight text-white">Roomify <span
                                className="text-zinc-500 font-normal">Studio</span></span>
                        </div>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                            onClick={handleBack}
                        >
                            <X className="icon w-4 h-4"/>
                            <span>Exit Editor</span>
                        </Button>
                    </div>
                </div>
            </nav>

            <section className="content pt-32 pb-12 px-4 md:px-6 min-h-screen flex flex-col justify-center">
                <div
                    className="panel max-w-6xl mx-auto w-full bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-1 shadow-2xl shadow-black/50 overflow-hidden relative">

                    <div className="bg-zinc-950/50 rounded-[22px] p-6 md:p-10 min-h-[600px] flex flex-col">


                        <div
                            className="panel-header mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                            <div>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Project
                                    Overview</p>
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{project?.name || `Residence ${id}`}</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-2.5 w-2.5 rounded-full ${currentImage ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-amber-500 animate-pulse'}`}/>
                                <p className="text-sm font-medium text-zinc-300">
                                    {currentImage ? "Render Complete" : isProcessing ? "AI Generating..." : "Ready to Start"}
                                </p>
                            </div>
                        </div>

                        <div
                            className="render-area relative flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner group">

                            <div
                                className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                            <div
                                className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                            {currentImage && (
                                <div className="relative w-full h-full animate-fade-in">
                                    <img
                                        src={currentImage}
                                        alt="AI Render"
                                        className="w-full h-full object-contain md:object-cover transition-all duration-700 ease-out"
                                    />
                                    <div
                                        className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                                </div>
                            )}

                            {!currentImage && !isProcessing && !error && (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                                    <div
                                        className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 shadow-xl">
                                        <Box className="w-8 h-8 opacity-50"/>
                                    </div>
                                    <p className="text-lg font-medium">Waiting for generation...</p>
                                    <p className="text-sm opacity-60 mt-2">Upload a plan to begin the magic</p>
                                </div>
                            )}

                            {error && (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/20 backdrop-blur-sm text-red-400 p-6 text-center">
                                    <div
                                        className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                                        <X size={32}/>
                                    </div>
                                    <p className="text-lg font-bold">Generation Failed</p>
                                    <p className="text-sm opacity-80 mt-2 max-w-md">{error}</p>
                                </div>
                            )}


                            {isProcessing && (
                                <div
                                    className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center z-20 transition-all duration-500">
                                    {/* Animated Rings */}
                                    <div className="relative w-24 h-24 mb-8">
                                        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                                        <div
                                            className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
                                        <div
                                            className="absolute inset-4 border-4 border-zinc-800 rounded-full opacity-50"></div>
                                        <div
                                            className="absolute inset-4 border-4 border-b-transparent border-t-pink-500 border-r-transparent border-l-transparent rounded-full animate-spin reverse-spin"
                                            style={{animationDirection: 'reverse', animationDuration: '3s'}}></div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Dreaming up your
                                        space</h3>


                                    <div className="flex items-center gap-2 mt-4">
                                    <span
                                        className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                        {steps[stepIndex]}
                                    </span>
                                    </div>


                                    <div
                                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-[scan_2s_ease-in-out_infinite]"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>


            <style jsx>{`
                @keyframes scan {
                    0% {
                        top: 0%;
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        top: 100%;
                        opacity: 0;
                    }
                }

                .reverse-spin {
                    animation-direction: reverse;
                }
            `}</style>
        </div>
    );
};

export default Visualizer;





