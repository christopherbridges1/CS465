const API_BASE = "http://localhost:3000/api";

const showLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

const showSignup = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};

const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const { token } = await response.json();

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax"
    });

    return res.redirect("/reservations");
  } catch (err) {
    return res.status(401).render("login", {
      title: "Login",
      error: "Invalid email or password"
    });
  }
};

const doSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    const data = await response.json();
    const token = data.token || data;

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax"
    });

    return res.redirect("/reservations");
  } catch (err) {
    return res.status(400).render("signup", {
      title: "Sign Up",
      error: "Signup failed. Try a different email."
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/");
};

module.exports = {
  showLogin,
  showSignup,
  doLogin,
  doSignup,
  logout
};
