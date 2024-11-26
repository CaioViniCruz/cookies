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

// Configuração da sessão
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Garantir cookie seguro apenas em produção
      httpOnly: true, // Evitar acesso via JavaScript
      sameSite: "strict", // Restrição de envio do cookie para o mesmo site
    },
  })
);

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Página de login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Processamento do login
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (username) {
    // Armazena o nome do usuário na sessão
    req.session.username = username;
    
    // Define o cookie de último acesso
    res.cookie("lastAccess", new Date().toLocaleString());
    
    // Redireciona para a página de cadastro
    res.redirect("/cadastro");
  } else {
    res.status(400).send("Nome de usuário é obrigatório.");
  }
});

// Página de cadastro
app.get("/cadastro", (req, res) => {
  if (req.session.username) {
    // Se o usuário estiver logado, exibe o formulário de cadastro
    res.sendFile(path.join(__dirname, "public", "cadastro.html"));
  } else {
    // Caso contrário, redireciona para o login
    res.redirect("/login");
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
