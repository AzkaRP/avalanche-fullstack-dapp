/**
 * Resolve backend URL from env and throw when missing at call time.
 */
function getBackendUrl() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!BACKEND_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  }
  return BACKEND_URL;
}

/**
 * Get latest blockchain value
 */
export async function getBlockchainValue() {
  const BACKEND_URL = getBackendUrl();
  const res = await fetch(`${BACKEND_URL}/blockchain/value`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blockchain value");
  }

  return res.json();
}

/**
 * Get blockchain events
 */
export async function getBlockchainEvents() {
  const BACKEND_URL = getBackendUrl();
  const res = await fetch(`${BACKEND_URL}/blockchain/events`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blockchain events");
  }

  return res.json();
}