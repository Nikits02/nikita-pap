import { authenticateRequest } from "./authenticateRequest.js";

export function authenticateAdmin(req, res, next) {
  return authenticateRequest(req, res, () => {
    if (req.auth.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Acesso reservado a administradores." });
    }

    req.admin = req.auth;
    return next();
  });
}
