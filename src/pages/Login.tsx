
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { loginWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, senha);
      window.location.href = "/dashboard";
    } catch (err) {
      setErro("Email ou senha inválidos.");
    }
  };

  const handleGoogleLogin = async () => {
    setErro("");
    try {
      console.log("Tentando login com Google...");
      await loginWithGoogle();
      console.log("Login com Google bem-sucedido");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Erro no login com Google:", err);
      const errorMessage = err instanceof Error ? err.message : "Falha ao autenticar com Google.";
      setErro(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <form onSubmit={handleLogin} className="bg-background p-8 rounded-xl shadow-card w-full max-w-sm border border-border">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Login Admin</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-border rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          className="w-full mb-4 p-3 border border-border rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        {erro && <div className="text-sm text-destructive mb-4 text-center">{erro}</div>}
        <button type="submit" className="w-full bg-primary text-white py-2 rounded-xl font-semibold mb-4 hover:bg-primary/90 transition-all">
          Entrar
        </button>
        <button
          type="button"
          className="w-full bg-muted text-foreground py-2 rounded-xl font-semibold flex items-center justify-center gap-2 border border-border hover:bg-muted/70 transition-all"
          onClick={handleGoogleLogin}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.5 24.5C47.5 23.1 47.4 21.7 47.2 20.3H24.5V28.2H37.4C36.9 30.7 35.4 32.8 33.3 34.2V39.1H40.2C44.1 35.6 47.5 30.6 47.5 24.5Z" fill="#4285F4"/>
              <path d="M24.5 47C30.1 47 34.8 45.2 38.2 42.2L33.3 37.3C31.3 38.7 28.9 39.5 26.3 39.5C20.9 39.5 16.3 35.8 14.7 30.8H7.6V35.8C11.1 42.1 17.3 47 24.5 47Z" fill="#34A853"/>
              <path d="M14.7 30.8C14.3 29.4 14.1 27.9 14.1 26.4C14.1 24.9 14.3 23.4 14.7 22V17H7.6C6.3 19.6 5.5 22.4 5.5 25.4C5.5 28.4 6.3 31.2 7.6 33.8L14.7 30.8Z" fill="#FBBC05"/>
              <path d="M24.5 14.5C27.3 14.5 29.8 15.4 31.7 17.2L36.1 12.8C32.8 9.8 28.1 7.9 24.5 7.9C17.3 7.9 11.1 12.8 7.6 19.1L14.7 22C16.3 17 20.9 14.5 24.5 14.5Z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          Entrar com Google
        </button>
      </form>
    </div>
  );
};

export default Login;
