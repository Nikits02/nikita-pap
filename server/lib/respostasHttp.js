export function sendServerError(res, logMessage, clientMessage, error) {
  console.error(`${logMessage}:`, error.message);
  return res.status(500).json({ message: clientMessage });
}
