/**
 * Receives the contact form.
 * Sends it to Zoho CRM (webform codes) and/or Resend (email).
 * Secrets live in Cloudflare environment variables, never in public/.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hits = new Map();

function json(status, data) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}

function text(value, max, keepBreaks) {
  if (typeof value !== "string") return "";
  var trimmed = value.trim().slice(0, max);
  return keepBreaks ? trimmed.replace(/\r\n/g, "\n") : trimmed.replace(/\s+/g, " ");
}

function limited(key) {
  var now = Date.now();
  var recent = (hits.get(key) || []).filter(function (time) {
    return now - time < 10 * 60 * 1000;
  });
  if (recent.length >= 5) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

function envValue(env, name) {
  var value = env[name];
  return typeof value === "string" ? value.trim() : "";
}

function splitName(full) {
  var parts = full.split(" ").filter(Boolean);
  if (parts.length < 2) return { first: "", last: full };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

async function postZoho(env, lead) {
  var url = envValue(env, "ZOHO_WEBFORM_URL");
  var xn = envValue(env, "ZOHO_XNQSJSDP");
  var xm = envValue(env, "ZOHO_XMIWTLD");
  if (!url || !xn || !xm) return false;
  var target;
  try {
    target = new URL(url);
  } catch (error) {
    return false;
  }
  if (target.protocol !== "https:" || !/zoho/i.test(target.hostname)) return false;
  var names = splitName(lead.name);
  var description = [
    lead.message,
    lead.company ? "Company: " + lead.company : "",
    lead.times ? "Times that work: " + lead.times : "",
    "Source: Seedgression website"
  ]
    .filter(Boolean)
    .join("\n\n");
  var body = new URLSearchParams();
  body.set("xnQsjsdp", xn);
  body.set("xmIwtLD", xm);
  body.set("actionType", envValue(env, "ZOHO_ACTION_TYPE") || "TGVhZHM=");
  body.set("First Name", names.first);
  body.set("Last Name", names.last);
  body.set("Email", lead.email);
  if (lead.company) body.set("Company", lead.company);
  body.set("Lead Source", "Website");
  body.set("Description", description);
  var response = await fetch(target.href, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    redirect: "manual"
  });
  return response.status >= 200 && response.status < 400;
}

async function postResend(apiKey, payload) {
  var response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("resend");
}

async function deliver(env, lead) {
  var apiKey = envValue(env, "RESEND_API_KEY");
  var from = envValue(env, "RESEND_FROM_EMAIL");
  var recipients = envValue(env, "RECIPIENT_EMAILS")
    .split(",")
    .map(function (item) {
      return item.trim();
    })
    .filter(function (item) {
      return EMAIL.test(item);
    });
  var resendReady = Boolean(apiKey && from && recipients.length);
  var zohoReady = Boolean(
    envValue(env, "ZOHO_WEBFORM_URL") &&
      envValue(env, "ZOHO_XNQSJSDP") &&
      envValue(env, "ZOHO_XMIWTLD")
  );
  if (!resendReady && !zohoReady) return "preview";

  var zoho = false;
  var mailed = false;
  if (zohoReady) {
    try {
      zoho = await postZoho(env, lead);
    } catch (error) {
      zoho = false;
    }
  }
  if (resendReady) {
    var safeName = lead.name.replace(/[\r\n]/g, " ");
    var textBody = [
      "Name: " + safeName,
      "Email: " + lead.email,
      lead.company ? "Company: " + lead.company : "",
      lead.times ? "Times that work:\n" + lead.times : "",
      "",
      lead.message
    ]
      .filter(function (line) {
        return line !== "";
      })
      .join("\n");
    try {
      await postResend(apiKey, {
        from: from,
        to: recipients,
        reply_to: lead.email,
        subject: "New enquiry from " + safeName,
        text: textBody
      });
      mailed = true;
      var replyTo = envValue(env, "REPLY_TO_EMAIL") || recipients[0];
      try {
        await postResend(apiKey, {
          from: from,
          to: [lead.email],
          reply_to: replyTo,
          subject: "We received your note — Seedgression",
          text: "Thank you for writing to Seedgression.\n\nA person on the team will read your note and reply with a useful next step, usually within a couple of business days.\n\n— Seedgression"
        });
      } catch (error) {
        /* The team already has the enquiry. */
      }
    } catch (error) {
      mailed = false;
    }
  }
  return zoho || mailed ? "sent" : "failed";
}

export async function onRequestPost(context) {
  var request = context.request;
  var url = new URL(request.url);
  var origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) {
    return json(403, { ok: false, message: "Please submit the form from this website." });
  }
  var input;
  try {
    input = await request.json();
  } catch (error) {
    return json(400, { ok: false, message: "The form data could not be read. Please try again." });
  }
  var lead = {
    name: text(input.name, 100),
    email: text(input.email, 254).toLowerCase(),
    company: text(input.company, 120),
    message: text(input.message, 4000, true),
    times: text(input.times, 300, true),
    fax: text(input.fax, 200)
  };
  var errors = {};
  if (lead.name.length < 2) errors.name = "Please tell us who to reply to.";
  if (!EMAIL.test(lead.email)) errors.email = "That email does not look complete.";
  if (lead.message.length < 10) errors.message = "A few honest sentences are enough.";
  if (Object.keys(errors).length) {
    return json(422, { ok: false, message: "Please check the highlighted fields.", fieldErrors: errors });
  }
  if (lead.fax) {
    return json(200, {
      ok: true,
      message: "Thank you. A person on the team will read this and reply with a useful next step."
    });
  }
  if (limited(lead.email)) {
    return json(429, {
      ok: false,
      message: "We already have a recent note from this email. Please wait a few minutes and try again."
    });
  }
  var status = await deliver(context.env, lead);
  if (status === "failed") {
    return json(502, {
      ok: false,
      message: "We could not send that just now. Please try again in a moment."
    });
  }
  return json(200, {
    ok: true,
    message:
      "Thank you. A person on the team will read this and reply with a useful next step, usually within a couple of business days."
  });
}
