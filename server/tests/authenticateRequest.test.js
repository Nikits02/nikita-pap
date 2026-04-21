import assert from "node:assert/strict";
import test from "node:test";
import { createAuthToken } from "../lib/auth.js";
import { authenticateRequest } from "../middleware/authenticateRequest.js";

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

test("authenticateRequest accepts a valid auth cookie", () => {
  process.env.JWT_SECRET = "test-secret";

  const token = createAuthToken({
    id: 5,
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

  authenticateRequest(req, res, () => {
    didCallNext = true;
  });

  assert.equal(didCallNext, true);
  assert.equal(res.statusCode, null);
  assert.equal(req.auth.userId, 5);
  assert.equal(req.auth.role, "user");
});

test("authenticateRequest rejects requests without auth data", () => {
  const req = {
    headers: {},
  };
  const res = createResponseMock();
  let didCallNext = false;

  authenticateRequest(req, res, () => {
    didCallNext = true;
  });

  assert.equal(didCallNext, false);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { message: "Token em falta." });
});
