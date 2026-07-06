import type { TxLineAdapter } from "./types";

export function createHttpAdapter(): TxLineAdapter {
  const baseUrl = process.env.TXLINE_API_BASE_URL;
  const guestJwt = process.env.TXLINE_GUEST_JWT;
  const apiToken = process.env.TXLINE_API_TOKEN;

  if (!baseUrl || !guestJwt || !apiToken) {
    throw new Error("Live TxLINE adapter requires TXLINE_API_BASE_URL, TXLINE_GUEST_JWT, and TXLINE_API_TOKEN.");
  }

  return {
    async listFixtures() {
      throw new Error("Live fixture mapping is intentionally disabled until API access is activated and tested.");
    },
    async listMarkets() {
      throw new Error("Live market mapping is intentionally disabled until API access is activated and tested.");
    },
    async latestEventForFixture() {
      throw new Error("Live event mapping is intentionally disabled until API access is activated and tested.");
    },
    async settleMarket() {
      throw new Error("Live settlement is intentionally disabled until API access is activated and tested.");
    },
  };
}
