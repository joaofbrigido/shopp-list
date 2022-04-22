import { FormEvent, useEffect, useState } from "react";
import { Button } from "../components/Button";
import mainIllustration from "../imgs/illustration.svg";
import "../styles/login.scss";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("login", ""); // Ao deslogar limpar a sessão
  }, []);

  function handleSignIn(e: FormEvent) {
    e.preventDefault();

    if (
      username === import.meta.env.VITE_APP_USERNAME &&
      password === import.meta.env.VITE_APP_PASSWORD
    ) {
      setError(false);
      setSuccess(true);
      localStorage.setItem("login", "true");
      window.location.href = `${window.location.href}home`;
    } else {
      setError(true);
      setSuccess(false);
    }
  }

  return (
    <main className="login mainContainer">
      <h1>Shopplist</h1>
      <img
        src={mainIllustration}
        alt="Homem com uma lista de compras ao lado de um carrinho de mercado"
      />

      {error && (
        <p style={{ color: "crimson", marginBottom: "16px" }}>
          Usuário ou Senha inválidos
        </p>
      )}

      <form onSubmit={handleSignIn}>
        <div className="inputWrapp">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className="inputWrapp">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div className="buttonWrapp">
          <Button disabled={success}>
            {success ? "ENTRANDO..." : "ENTRAR"}
          </Button>
        </div>
      </form>
    </main>
  );
};
