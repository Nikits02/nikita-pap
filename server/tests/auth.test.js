import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTH_COOKIE_NAME,
  buildAuthResponseBody,
  clearAuthCookie,
  createAuthSuccess,
} from "../lib/auth.js";

function createResponseMock() {
  return {
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
  };
}

test("createAuthSuccess returns user payload and sets auth cookie", () => {
  process.env.JWT_SECRET = "test-secret";
  process.env.NODE_ENV = "test";

  const response = createResponseMock();
  const user = {
    id: 12,
    username: "admin",
    role: "admin",
    nome: "admin",
    email: "",
  };

  const result = createAuthSuccess(response, user);

  assert.deepEqual(result, buildAuthResponseBody(user));
  assert.equal("token" in result, false);
  assert.match(response.headers["Set-Cookie"], new RegExp(`^${AUTH_COOKIE_NAME}=`));
  assert.match(response.headers["Set-Cookie"], /HttpOnly/);
  assert.match(response.headers["Set-Cookie"], /SameSite=Lax/);
  assert.doesNotMatch(response.headers["Set-Cookie"], /Max-Age=0/);
});

test("clearAuthCookie expires the auth cookie", () => {
  const response = createResponseMock();

  clearAuthCookie(response);

  assert.match(response.headers["Set-Cookie"], new RegExp(`^${AUTH_COOKIE_NAME}=`));
  assert.match(response.headers["Set-Cookie"], /Max-Age=0/);
});
