import Navbar from "../../components/Navbar";
import { Users, Star, MessageCircle, Heart } from "lucide-react";

export default function Community() {

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <div className="pt-36 px-4 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20">

                    <h1 className="text-5xl font-bold mb-6">
                        Our Community
                    </h1>

                    <p className="text-white/50 max-w-2xl mx-auto text-lg">
                        Connect with architects, designers, and creators
                        from all over the world.
                    </p>

                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-24">

                    {[
                        { icon: Users, title: "20K+", desc: "Members" },
                        { icon: MessageCircle, title: "50K+", desc: "Discussions" },
                        { icon: Star, title: "4.9/5", desc: "Rating" },
                        { icon: Heart, title: "99%", desc: "Satisfaction" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-[#0a0a0a]/60 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-xl"
                        >
                            <item.icon className="mx-auto mb-4 text-purple-400" size={32} />

                            <h3 className="text-2xl font-bold mb-1">
                                {item.title}
                            </h3>

                            <p className="text-white/40">
                                {item.desc}
                            </p>
                        </div>
                    ))}

                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-3 gap-8 mb-32">

                    {[
                        {
                            name: "Alex Morgan",
                            text: "Roomify helped me speed up my workflow massively."
                        },
                        {
                            name: "Nimal Perera",
                            text: "Best AI architecture tool I’ve ever used."
                        },
                        {
                            name: "Sophia Lee",
                            text: "Amazing community and fast support."
                        },
                    ].map((user, i) => (
                        <div
                            key={i}
                            className="bg-[#0a0a0a]/50 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
                        >
                            <p className="text-white/60 italic mb-6">
                                "{user.text}"
                            </p>

                            <p className="font-semibold">
                                — {user.name}
                            </p>
                        </div>
                    ))}

                </div>

                {/* CTA */}
                <div className="text-center pb-32">

                    <h2 className="text-4xl font-bold mb-6">
                        Join Our Growing Family
                    </h2>

                    <p className="text-white/50 mb-8">
                        Learn, share, and grow with professionals worldwide.
                    </p>

                    <a
                        href="/home"
                        className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all"
                    >
                        Join Now
                    </a>

                </div>

            </div>
        </div>
    );
}