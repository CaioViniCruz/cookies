const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sessão e cookies
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Só ativa em produção
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

// Página inicial
app.get("/", (req, res) => {
  console.log('Acessando página inicial');
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Página de login
app.get("/login", (req, res) => {
  console.log('Acessando página de login');
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Processamento do login
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (username) {
    console.log(`Login bem-sucedido para o usuário: ${username}`);
    req.session.username = username;
    res.cookie("lastAccess", new Date().toLocaleString());
    res.redirect("/cadastro");
  } else {
    console.log('Erro no login: nome de usuário não fornecido');
    res.status(400).send("Nome de usuário é obrigatório.");
  }
});

// Página de cadastro
app.get("/cadastro", (req, res) => {
  console.log('Acessando página de cadastro');
  if (req.session.username) {
    res.sendFile(path.join(__dirname, "public", "cadastro.html"));
  } else {
    console.log('Usuário não logado, redirecionando para login');
    res.redirect("/login");
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
