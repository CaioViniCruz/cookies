const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public"))); // Serve arquivos estáticos da pasta public
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Garante que o cookie seja seguro apenas em produção
      httpOnly: true, // Evita que o cookie seja acessado via JavaScript
      sameSite: "strict", // Restrição de envio do cookie para o mesmo site
    },
  })
);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.username = username;
    res.cookie("lastAccess", new Date().toLocaleString());
    console.log(req.cookies); // Verifica se o cookie está sendo configurado
    res.redirect("/cadastro");
  } else {
    res.status(400).send("Nome de usuário é obrigatório.");
  }
});


app.get("/cadastro", (req, res) => {
  if (req.session.username) {
    res.sendFile(path.join(__dirname, "public", "cadastro.html"));
  } else {
    res.send("Você precisa fazer login primeiro.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
