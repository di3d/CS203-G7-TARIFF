import { NextResponse } from "next/server";

// Proxy to currencyapi.com (or other provider via env). Returns { converted, rate, to, date }
// Usage: GET /api/exchange?from=USD&to=EUR&amount=123
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const amount = url.searchParams.get("amount");

    if (!from || !to || !amount) {
      return NextResponse.json({ error: "Missing query parameters (from,to,amount)" }, { status: 400 });
    }

    const amountNum = Number(amount);
    if (Number.isNaN(amountNum)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Prefer an explicit provider key set in env. If not present, fall back to the provided key (from user).
    const envKey = process.env.CURRENCYAPI_KEY;
    const fallbackKey = "MY_API"; // provided by user
    const apiKey = envKey ?? fallbackKey;

    // Provider base. Use EXCHANGE_PROVIDER_URL if set, otherwise default to currencyapi.com's v3 base.
    // Prefer the `/latest` endpoint which returns rates (user requested this style), so we compute converted = rate * amount.
    const providerBase = process.env.EXCHANGE_PROVIDER_URL ?? "https://api.currencyapi.com/v3";
    let providerUrl: string;
    if (providerBase.includes("currencyapi.com")) {
      // currencyapi expects `base_currency` and `currencies` on /v3/latest
      providerUrl = `${providerBase}/latest?apikey=${encodeURIComponent(apiKey)}&base_currency=${encodeURIComponent(from)}&currencies=${encodeURIComponent(to)}`;
    } else {
      // Fallback to a convert-style endpoint (include amount/value for compatibility)
      providerUrl = `${providerBase}/convert?apikey=${encodeURIComponent(apiKey)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(String(amountNum))}&value=${encodeURIComponent(String(amountNum))}`;
    }

    const res = await fetch(providerUrl);
    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ error: "Provider error", detail, status: res.status }, { status: 502 });
    }

    const payload = await res.json();

    // Normalise response shapes.
    // If we called /latest (currencyapi.com), payload.data will contain target currency entries like:
    // { data: { JPY: { code: 'JPY', value: 149.64 } }, meta: { last_updated_at: '...' } }
    let converted: number | null = null;
    let rate: number | null = null;
    let date: string | null = null;

    if (payload && payload.data && payload.data[to] && typeof payload.data[to].value === "number") {
      const r = payload.data[to].value as number;
      rate = r;
      converted = r * amountNum;
      date = payload.meta?.last_updated_at ?? payload.data[to]?.date ?? new Date().toISOString();
    } else {
      // Fallbacks for other providers / shapes (convert endpoint)
      if (typeof payload.converted === "number") converted = payload.converted;
      if (typeof payload.result === "number") converted = payload.result;
      if (!converted && payload.data && typeof payload.data.result === "number") converted = payload.data.result;

      if (payload.info && typeof payload.info.rate === "number") rate = payload.info.rate;
      if (!rate && payload.rate && typeof payload.rate === "number") rate = payload.rate;
      date = payload.data?.date ?? payload.date ?? new Date().toISOString();

      if ((rate === null || rate === undefined) && typeof converted === "number" && amountNum !== 0) {
        rate = converted / amountNum;
      }
    }

    if (typeof converted !== "number") {
      return NextResponse.json({ error: "Invalid provider response", raw: payload }, { status: 502 });
    }

    return NextResponse.json({ converted, rate, to: to.toUpperCase(), date });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message ?? "Unknown error" }, { status: 500 });
  }
}
