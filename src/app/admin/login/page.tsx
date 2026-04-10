"use client";
 
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
 
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
 
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
 
      if (res?.error) {
        setError("Invalid credentials");
        addToast({
          type: "error",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
      } else {
        addToast({
          type: "success",
          title: "Login Successful!",
          description: "Welcome back! Redirecting to admin panel...",
        });
        
        // Small delay to show the success toast
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      addToast({
        type: "error",
        title: "Connection Error",
        description: "Unable to connect. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}