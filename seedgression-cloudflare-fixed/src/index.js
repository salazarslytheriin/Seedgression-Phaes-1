import { onRequestPost } from "./contact.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact" && request.method === "POST") {
      return onRequestPost({ request, env });
    }
    if (url.pathname === "/api/contact") {
      return Response.json(
        { ok: false, message: "Use the form." },
        { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } }
      );
    }
    return env.ASSETS.fetch(request);
  }
};
