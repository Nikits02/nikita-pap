import assert from "node:assert/strict";
import test from "node:test";
import { createAuthToken } from "../lib/auth.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";

function createResponseMock() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("authenticateAdmin accepts authenticated admin users", () => {
  process.env.JWT_SECRET = "test-secret";

  const token = createAuthToken({
    id: 1,
    username: "admin",
    role: "admin",
  });
  const req = {
    headers: {
      cookie: `auth_token=${token}`,
    },
  };
  const res = createResponseMock();
  let didCallNext = false;

  authenticateAdmin(req, res, () => {
    didCallNext = true;
  });

  assert.equal(didCallNext, true);
  assert.equal(res.statusCode, null);
  assert.equal(req.admin.userId, 1);
  assert.equal(req.admin.role, "admin");
});

test("authenticateAdmin rejects authenticated non-admin users", () => {
  process.env.JWT_SECRET = "test-secret";

  const token = createAuthToken({
    id: 2,
    username: "cliente",
    role: "user",
  });
  const req = {
    headers: {
      cookie: `auth_token=${token}`,
    },
  };
  const res = createResponseMock();
  let didCallNext = false;

  authenticateAdmin(req, res, () => {
    didCallNext = true;
  });

  assert.equal(didCallNext, false);
  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, {
    message: "Acesso reservado a administradores.",
  });
});

