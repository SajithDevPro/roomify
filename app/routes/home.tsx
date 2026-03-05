import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import {
    ArrowRight, ArrowUpRight, Clock, Layers, UploadIcon, Sparkles, Zap, Shield, Users, Star, CheckCircle
} from "lucide-react";
import Button from "../../components/UI/Button";
import Upload from "../../components/Upload";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, getProjects } from "../../lib/puter.action";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Roomify - AI-Powered 3D Floor Plan Rendering" },
        { name: "description", content: "Transform 2D floor plans into photorealistic 3D renders instantly using next-gen generative AI. Experience the future of architectural visualization." },
    ];
}

export default function Home() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<DesignItem[]>([]);
    const isCreatingProjectRef = useRef(false);
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState({
        hero: false,
        features: false,
        projects: false,
        testimonials: false,
        cta: false
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsVisible({
                hero: true,
                features: scrollY > 100,
                projects: scrollY > 400,
                testimonials: scrollY > 800,
                cta: scrollY > 1200
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleUploadComplete = async (base64: string) => {
        if (isCreatingProjectRef.current) return false;
        isCreatingProjectRef.current = true;

        try {
            const newId = Date.now().toString();
            const name = `Residence ${newId}`;

            const newItem: DesignItem = {
                id: newId,
                name,
                sourceImage: base64,
                renderedImage: undefined,
                timestamp: Date.now(),
            };

            const saved = await createProject({ item: newItem });

            if (!saved) return false;

            setProjects((prev) => [saved, ...prev]);
            navigate(`/visualizer/${newId}`);
            return true;
        } finally {
            isCreatingProjectRef.current = false;
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            const items = await getProjects();
            setProjects(items);
        };
        fetchProjects();
    }, []);

    return (
        <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans antialiased">
            <div
                className="fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0"
                style={{
                    background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
                }}
            />

            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.1),_transparent_50%),_radial-gradient(ellipse_at_bottom,_rgba(139,92,246,0.05),_transparent_50%)]" />
            <div
                className="fixed inset-0 opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
                }}
            />

            <div className="fixed top-1/4 left-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="fixed bottom-1/4 right-1/4 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse-slower" />

            <Navbar />

            <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-8 backdrop-blur-sm hover:scale-105 transition-all duration-300 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                            }`}
                            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                AI-Powered Architecture
                            </span>
                        </div>

                        <h1
                            className={`text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-8 transition-all duration-700 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                                Build beautiful
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                                spaces at thought speed
                            </span>
                        </h1>

                        <p
                            className={`text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-100 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        >
                            Transform 2D floor plans into photorealistic 3D renders instantly using next-gen generative AI.
                            Experience the future of architectural visualization.
                        </p>

                        <div
                            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-200 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <button
                                onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Creating Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </button>

                            <button
                                onClick={() => window.open('https://demo.roomify.ai', '_blank')}
                                className="group border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
                            >
                                <span className="flex items-center gap-2">
                                    View Demo
                                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                                </span>
                            </button>
                        </div>

                        <div
                            className={`flex items-center justify-center gap-8 md:gap-16 mb-20 transition-all duration-700 delay-300 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <div className="text-center group">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">10K+</div>
                                <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Projects Generated</div>
                            </div>
                            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                            <div className="text-center group">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">2.5s</div>
                                <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Avg. Generation</div>
                            </div>
                            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                            <div className="text-center group">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">98%</div>
                                <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Satisfaction</div>
                            </div>
                        </div>

                        <div
                            id="upload"
                            className={`max-w-3xl mx-auto relative group transition-all duration-1000 delay-500 ${isVisible.hero ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[2.5rem] opacity-20 group-hover:opacity-40 transition duration-1000 blur-2xl group-hover:blur-3xl" />

                            <div className="relative bg-[#0a0a0a]/40 border border-white/10 rounded-[2rem] p-1.5 backdrop-blur-3xl shadow-premium overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <div className="relative bg-[#0a0a0a]/60 rounded-[1.8rem] p-8 md:p-12">
                                    <Upload onComplete={handleUploadComplete} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Powered by cutting-edge AI
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            Experience the perfect blend of technology and design with our advanced features
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                description: "Generate photorealistic renders in seconds, not hours"
                            },
                            {
                                icon: Shield,
                                title: "Enterprise Security",
                                description: "Your designs are encrypted and never shared with third parties"
                            },
                            {
                                icon: Users,
                                title: "Collaborative",
                                description: "Share and collaborate with your team in real-time"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative transition-all duration-700 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur" />
                                <div className="relative bg-[#14141A] border border-white/10 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                    <p className="text-white/40 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div className={`${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Your Projects</h2>
                            <p className="text-white/40 text-lg">Manage and view your AI-enhanced architectural spaces</p>
                        </div>

                        <button className={`hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300 group ${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <span className="text-sm font-medium">View all projects</span>
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/50 transition-all duration-300">
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </button>
                    </div>

                    {projects.length === 0 ? (
                        <div
                            className={`relative group transition-all duration-1000 ${isVisible.projects ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-600/20 to-pink-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-700 blur-2xl" />
                            <div className="relative border border-white/10 rounded-[2.5rem] p-24 text-center bg-[#0a0a0a]/40 backdrop-blur-3xl overflow-hidden shadow-premium">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                                        <Layers className="w-10 h-10 text-white/20 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <p className="text-2xl font-bold text-white mb-3">No projects yet</p>
                                    <p className="text-white/40 mb-10 text-lg max-w-md mx-auto">Upload your first floor plan to see the magic of AI architecture come to life.</p>
                                    <button
                                        onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
                                    >
                                        <UploadIcon className="w-5 h-5" />
                                        Upload your first plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map(({ id, name, renderedImage, timestamp }, index) => {
                                const status = renderedImage ? "Completed" : "Processing";
                                const isCompleted = !!renderedImage;

                                return (
                                    <div
                                        key={id}
                                        onClick={() => navigate(`/visualizer/${id}`)}
                                        onMouseEnter={() => setHoveredProject(id)}
                                        onMouseLeave={() => setHoveredProject(null)}
                                        className={`group relative cursor-pointer transition-all duration-700 ${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                        }`}
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />

                                        <div className="relative bg-gradient-to-b from-[#14141A] to-[#0A0A0F] border border-white/10 rounded-xl overflow-hidden hover:-translate-y-2 transition-all duration-500">
                                            {/* Image Container */}
                                            <div className="relative h-64 overflow-hidden bg-[#0A0A0F]">
                                                {renderedImage ? (
                                                    <>
                                                        <img
                                                            src={renderedImage}
                                                            alt={name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F15] via-transparent to-transparent opacity-60" />

                                                        {/* Hover Overlay */}
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                            <span className="text-white font-medium px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                                                Click to view
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="h-full w-full flex flex-col items-center justify-center">
                                                        <div className="relative">
                                                            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                                                            <div className="absolute inset-0 border-4 border-blue-500/10 border-b-blue-500 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                                                        </div>
                                                        <span className="text-white/40 text-sm font-medium mt-4">Generating...</span>
                                                    </div>
                                                )}

                                                {/* Status Badge */}
                                                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${isCompleted
                                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                                }`}>
                                                    {status}
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors mb-2 truncate">
                                                    {name}
                                                </h3>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-xs text-white/40">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{new Date(timestamp).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                                                        <span className="text-xs text-white/40">{isCompleted ? 'Ready' : 'Processing'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Loved by architects worldwide
                        </h2>
                        <p className="text-white/40 text-lg max-w-2xl mx-auto">
                            Join thousands of professionals who have accelerated their design process with Roomify
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`group relative bg-[#0a0a0a]/40 border border-white/10 rounded-[2rem] p-8 hover:bg-[#0a0a0a]/60 hover:border-blue-500/30 transition-all duration-500 backdrop-blur-3xl ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-[2rem]" />
                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-5 h-5 fill-blue-500 text-blue-500" />
                                    ))}
                                </div>
                                <p className="text-white/60 mb-8 leading-relaxed text-lg italic italic">
                                    "Roomify has completely transformed our workflow. We can now generate photorealistic renders in seconds instead of hours."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[1px]">
                                        <div className="w-full h-full bg-[#0a0a0a] rounded-[15px] flex items-center justify-center text-white font-bold text-lg">
                                            S
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">John Williams</p>
                                        <p className="text-sm text-white/40">Architect at Studio Globe NYC</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="py-40 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <div
                        className={`relative group transition-all duration-1000 ${isVisible.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-[3rem] opacity-20 blur-3xl group-hover:opacity-40 transition duration-1000" />
                        <div className="relative bg-[#0a0a0a]/40 border border-white/10 rounded-[3rem] p-12 md:p-24 backdrop-blur-3xl overflow-hidden shadow-premium">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                                Ready to transform<br />your designs?
                            </h2>
                            <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join our community of forward-thinking architects and start creating professional visualizations today.
                            </p>
                            <button
                                onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-white/10"
                            >
                                <span className="flex items-center gap-2">
                                    Get Started for Free
                                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.05); }
        }

        @keyframes pulse-slower {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.1); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
        </div>
    );
}









