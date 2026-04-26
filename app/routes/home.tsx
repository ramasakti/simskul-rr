import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "SIMSKUL Single Sign On" },
        { name: "description", content: "Selamat Datang di SIMSKUL!" },
    ];
}

export default function Home() {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await login({ email, password });

        if (result.success) {
            navigate("/dashboard");
        } else {
            toast.error(result.message || "Email atau password salah.");
            setIsLoading(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-[#066fd1]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center p-6">
            <Toaster/>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#066fd1]">SIMSKUL Single Sign On</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Please sign in to continue
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#066fd1]/30 focus:border-[#066fd1] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#066fd1]/30 focus:border-[#066fd1] transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#066fd1]"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#066fd1] hover:bg-[#055bb0] text-white font-semibold py-2.5 rounded-lg transition flex justify-center items-center disabled:opacity-60"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow h-px bg-gray-200" />
                    <span className="px-3 text-xs text-gray-400">OR</span>
                    <div className="flex-grow h-px bg-gray-200" />
                </div>

                {/* Google Button */}
                <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 hover:bg-[#f6f8fb] transition">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Sign in with Google
                    </span>
                </button>
            </div>
        </div>
    );
}
