import Navbar from "../../components/Navbar";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function Pricing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <div className="pt-40 px-4 flex justify-center">
                <div className="max-w-md w-full">

                    <div className="bg-[#0a0a0a]/60 border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-premium text-center">

                        <h1 className="text-4xl font-bold mb-4">
                            Simple Pricing
                        </h1>

                        <p className="text-white/50 mb-8">
                            No hidden fees. Start creating today.
                        </p>

                        <div className="text-5xl font-bold mb-2">
                            $0
                        </div>

                        <p className="text-white/40 mb-8">
                            100% Free • No Credit Card Required
                        </p>

                        <div className="space-y-3 mb-8 text-left">
                            {[
                                "Unlimited Uploads",
                                "AI Rendering",
                                "High Quality Images",
                                "Cloud Storage",
                                "Community Access"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle className="text-green-400 w-5 h-5" />
                                    <span className="text-white/70">{item}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("/home")}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-105 transition-all"
                        >
                            Get Started Free
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}

