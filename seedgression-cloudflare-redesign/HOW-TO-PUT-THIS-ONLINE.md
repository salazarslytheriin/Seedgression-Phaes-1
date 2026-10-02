# How to put the Seedgression website on the internet

Read this from the top. Do the steps in order. You do not need to write code. You will click, copy, and paste.

There are three websites you will log in to:

1. **GitHub** — a shelf where the website files live.
2. **Cloudflare** — the thing that shows the website to the world, and that receives the contact form.
3. **Resend**, **Zoho CRM**, and **Calendly** — the tools that get the message, save the lead, and book the call.

The hummingbird film, the pages, and the form are already built. You are only connecting them.

---

## The two kinds of files

Unzip the download. You should see a folder. Inside it:

| What | Why it exists |
| --- | --- |
| `public/` | Every page, the hummingbird film, the colours, the fonts. This is what visitors see. |
| `functions/api/contact.js` | The small program that receives the contact form and passes it to Zoho and email. |
| `HOW-TO-PUT-THIS-ONLINE.md` | This guide. |
| `README.md` | A short note. |

Do **not** put passwords, API keys, or Zoho codes inside `public/`. That folder is visible to anyone who opens the site. Secrets go into Cloudflare later, in a locked box called environment variables.

---

## Part 1 — Put the files on GitHub

GitHub is a free place to store the files. Cloudflare will watch that shelf and publish the site whenever the files change.

1. Go to [https://github.com](https://github.com) and create an account if you do not have one. Confirm the email GitHub sends you.
2. When you are logged in, click the **+** at the top right, then **New repository**.
3. Repository name: `seedgression`
4. Leave it **Public** (either is fine; Public is simpler).
5. Leave **Add a README** switched **off**. Leave the licence and gitignore menus on **None**.
6. Click **Create repository**.
7. On the empty repository page, click **uploading an existing file**. (If you do not see that sentence, click **Add file**, then **Upload files**.)
8. On your computer, open the unzipped folder. Select **everything inside it**: the `public` folder, the `functions` folder, this guide, and the README. Drag that whole selection into the GitHub page.
9. Wait until every file has finished uploading. The film file is the big one. Be patient.
10. At the bottom, click **Commit changes**.

Check the result. The repository page should show folders named `public` and `functions` sitting next to each other. If you instead see only one folder and `public` is inside it, that is still ok — remember that extra folder name. You will type it into Cloudflare in the next part as the root directory. If `public` is on the top level, leave the root directory blank.

---

## Part 2 — Publish it with Cloudflare

Cloudflare Pages is the free host. It also runs the contact form.

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) and create a free account.
2. Open **Workers & Pages**. The direct link is [https://dash.cloudflare.com/?to=/:account/workers-and-pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages).
3. Click **Create**, then **Create application**.
4. Choose the **Pages** tab, then **Connect to Git**.
5. Choose **GitHub**. Cloudflare will ask GitHub for permission. Click **Install & Authorize** (or Approve). If it asks which repositories, choose **Only select repositories** and tick `seedgression`. That is safer than giving it every repository you own.
6. Back in Cloudflare, select the `seedgression` repository. Click **Begin setup**.
7. Project name: `seedgression` (this becomes the first web address, `seedgression.pages.dev`. You can change the name if that one is taken).
8. Production branch: `main`.
9. Framework preset: **None**.
10. Build command: type exactly `exit 0`
11. Build output directory: type exactly `public`
12. If your files are nested inside an extra folder, open **Root directory (advanced)** and type that folder’s name. If `public` is already at the top, leave this empty.
13. Click **Save and Deploy**.
14. Wait until the deployment says **Success**. Click the link that ends in `.pages.dev`.

You should see the Seedgression homepage, with the hummingbird flying in. Click **Contact** and send yourself a test note. The page will say thank you. **Nothing will arrive in email or Zoho yet.** That is expected. The next parts connect those tools. Do not skip them and then wonder where the message went.

---

## Part 3 — Change a colour or a sentence later

You do this on GitHub, in the browser. No special program.

**Colours**

1. In the GitHub repository, open `public`, then `styles.css`.
2. Click the pencil icon (**Edit this file**).
3. At the very top, inside `:root { ... }`, you will see names like `--ink` and `--royal`. The code after the colon is the colour.
4. Change only the colour codes. Keep the names.

| Name | What it paints | Starting colour |
| --- | --- | --- |
| `--ink` | Headlines and main text | `#073f54` |
| `--paper` | Page background | `#f6f8f7` |
| `--royal` | Buttons and the focus outline | `#2c58a8` |
| `--slate` | Quieter paragraphs | `#49606b` |
| `--mint` | The small green dot | `#64c39e` |
| `--sky` | Do not use this for sentences. It is too light to read. | `#39bdd4` |

5. Click **Commit changes**.
6. Cloudflare notices the change and publishes again. Give it a minute, then refresh the site. If you still see the old colour, refresh with a hard reload (on a Mac, hold Shift and click reload).

**Words**

- The homepage text is `public/index.html`.
- How it works is `public/how-it-works/index.html`.
- Contact is `public/contact/index.html`.
- Insights are the files under `public/insights/`.

Open the file, click the pencil, change the sentence, commit. Do not delete the bits in angle brackets (`<h1>`, `<p>`, and so on). Those are the structure. Change the words between them.

**Hide the plans**

Sprout, Bloom, and Ascend are on the homepage as ways of working, not as prices. If you want them private until you have worked with a few clients:

1. Open `public/site-config.js`.
2. Change `showPlans: true` to `showPlans: false`.
3. Commit.

Or delete the block in `index.html` that starts with the comment `PLANS:`.

---

## Part 4 — Calendly, so people can book a time

The contact page already explains that someone can suggest times in the form. When you add a Calendly link, a real calendar also appears under **Prefer to talk it through?** Nothing on the page says the calendar is missing before you do this.

1. Go to [https://calendly.com](https://calendly.com) and create an account.
2. Create an event type. A clear name is **Discovery call**. Thirty minutes is a good length.
3. Open that event and copy its link. It looks like `https://calendly.com/your-name/discovery`.
4. On GitHub, open `public/site-config.js`, click the pencil, and paste the link between the quotes:

```js
calendlyUrl: "https://calendly.com/your-name/discovery",
```

5. Commit changes.
6. Wait for Cloudflare to finish the new deployment. Open the contact page. Scroll to **Prefer to talk it through?** The calendar should be there, in the same colours as the site.

If you also want your email address shown in the footer, put it in `publicEmail` in that same file. Leave it as `""` if you would rather not publish an address.

---

## Part 5 — Resend, so the form sends email

Resend is the email service. It sends two messages when the form works:

- One to you, with what the person wrote. You can hit reply and it goes to them.
- One short note back to them, saying a person will read it.

Resend will not send from an address it has not checked. You prove the address by adding a few DNS records. DNS is the phone book of the internet. If your domain is on Cloudflare, Resend can write those records for you.

1. Go to [https://resend.com](https://resend.com) and create an account.
2. Open **Domains** and click **Add domain**.
3. Type the domain you will send from, for example `seedgression.com`. Resend may suggest a subdomain such as `hello.seedgression.com`. A subdomain is a good idea, but the address people see must match a domain you verify. If you want the from-address to be `hello@seedgression.com`, verify `seedgression.com`.
4. If you see **Sign in to Cloudflare**, click it and approve. That is the easy path. Skip to step 6.
5. If you add the records yourself:
   - In Resend, open the domain and the **Records** tab. You will see a list. Copy it exactly. Do not retype from memory.
   - In Cloudflare, open your domain, then **DNS**, then **Records**, then **Add record**.
   - For each row Resend shows, set the same Type, Name, and Content (sometimes called Value or Mail server).
   - If the type is **CNAME**, click the orange cloud until it turns **grey**. Grey means **DNS only**. An orange cloud will stop the domain from verifying.
   - Save each record.
6. Wait. It often turns **Verified** within 15 minutes. It can take longer. There is a **Restart verification** button if it sits there for hours.
7. In Resend, open **API Keys**, create a key, and copy it. It starts with `re_`. You will see it once. Paste it into a note on your computer for the next part. Do not put it in GitHub.

You will also choose the from-address, for example:

`Seedgression <hello@seedgression.com>`

The part inside `< >` must be on the domain you just verified.

---

## Part 6 — Zoho CRM, so the form becomes a lead

The website does not paste Zoho’s form onto the page. Visitors use our contact page. Behind the scenes, Cloudflare hands the same details to a Zoho webform. You create that webform only to get two codes and a web address.

1. Log in to Zoho CRM.
2. Click the **gear** (Setup).
3. In the setup search box, type **Webforms** and open it. You can also go to **Setup → Channels → Webforms**.
4. Set the module to **Leads**.
5. Click **New Form**. Name it `Website enquiry`.
6. Drag these fields onto the form. The names need to match, because that is what the website sends:
   - First Name
   - Last Name
   - Email
   - Company
   - Description
   - Lead Source
7. Click through to the settings. If you see **Form location URL** (a rule that only accepts forms from one address), **leave it empty**. A filled-in location often blocks messages that come from Cloudflare rather than from a form pasted on the page.
8. Save the form.
9. Choose the **Source** code (the HTML), not the pretty embed, and copy it into a text note.
10. Find these three things in that code. They look similar to this:

```html
<form action='https://crm.zoho.com/crm/WebToLeadForm' ...>
<input type='text' name='xnQsjsdp' value='PASTE-THIS-LONG-CODE'>
<input type='text' name='xmIwtLD' value='PASTE-THIS-OTHER-CODE'>
<input type='text' name='actionType' value='TGVhZHM='>
```

Write down:

- The address in `action='...'`. If your Zoho is in Europe it may say `crm.zoho.eu`. Use the one in **your** code, not the example.
- The value of `xnQsjsdp`.
- The value of `xmIwtLD`.
- The value of `actionType` if it is not `TGVhZHM=`.

Do not publish those codes on GitHub. The next part is where they go.

In Zoho you can also turn on a notification to yourself when a lead arrives. That is a useful backup. Setup is inside the same webform’s notification options.

---

## Part 7 — Give Cloudflare the keys

This is the locked box. Values typed here are not shown on the website.

1. In Cloudflare, open your Pages project.
2. Go to **Settings → Environment variables**.
3. Add each row below for the **Production** environment. Add them for **Preview** as well if you want test branches to send real messages. Otherwise Production is enough.
4. When the dashboard offers **Encrypt** or **Secret**, use it for the API key and the two Zoho codes.

| Name | What to paste | Secret? |
| --- | --- | --- |
| `RESEND_API_KEY` | The `re_...` key from Resend | Yes |
| `RESEND_FROM_EMAIL` | `Seedgression <hello@seedgression.com>` using your real verified address | No |
| `RECIPIENT_EMAILS` | The inboxes that should receive enquiries. More than one is allowed, separated by commas: `you@seedgression.com, partner@seedgression.com` | No |
| `REPLY_TO_EMAIL` | The address people should hit when they reply to the thank-you note. Often the same as the first recipient. | No |
| `ZOHO_WEBFORM_URL` | The `action` address from the Zoho code, starting with `https://` | No |
| `ZOHO_XNQSJSDP` | The first hidden code | Yes |
| `ZOHO_XMIWTLD` | The second hidden code | Yes |
| `ZOHO_ACTION_TYPE` | Only if your code’s `actionType` is not `TGVhZHM=`. Otherwise you can skip this row. | No |

5. Save.
6. Open **Deployments**, open the latest one, and click **Retry deployment**. New variables are not used until a deployment runs again.
7. Wait for Success.

You can connect **just email**, **just Zoho**, or **both**. If at least one of them is filled in properly, the form will deliver there. If a configured service fails, the visitor sees a short “try again” message instead of a false thank-you.

---

## Part 8 — Test it like a stranger

1. Open your `.pages.dev` address, or your real domain once Part 9 is done.
2. Go to Contact.
3. Use a personal email address you can open, not the same address as `RECIPIENT_EMAILS` if you can help it. Write a few real sentences.
4. Click **Send the note**.
5. You should see **We have it.**
6. Check the recipient inbox. Subject: `New enquiry from` and the name you typed. Reply should go to the personal address you used.
7. Check the personal inbox for **We received your note — Seedgression**.
8. In Zoho CRM, open **Leads**. The new lead should be there, with the message in the description.

If the page says thank you but nothing arrives:

- The deployment was not retried after you saved the variables.
- A name is misspelled. They must match the table exactly, including capitals.
- Resend still says the domain is not verified, or the from-address uses a different domain.
- The Zoho form location URL is filled in. Clear it.
- The Zoho field names are not First Name, Last Name, Email, Company, Description, and Lead Source.

If the page says it could not send: one of the services refused the message. In Cloudflare, open the project, then **Deployments**, then the latest deployment, and look at **Functions** logs if they are offered. The log will not print the person’s message, but a failed call usually shows a status code.

---

## Part 9 — Use your own domain

`something.pages.dev` is a real public address. You can share it. When you are ready for `seedgression.com`:

1. The domain needs to be on Cloudflare’s DNS. If you bought it somewhere else, Cloudflare’s dashboard will walk you through pointing the nameservers at Cloudflare. That is a registrar setting, not a website setting. Do it before the next step, and wait until Cloudflare says the domain is active.
2. Open the Pages project → **Custom domains** → **Set up a domain**.
3. Type `seedgression.com` and, if you want, `www.seedgression.com`.
4. Cloudflare will offer to add the DNS records for you. Accept that.
5. Wait until the domain says **Active**. Then open it.

---

## What the contact page promises

The page tells people three things, and the team has to actually do them:

1. A person reads every enquiry.
2. Someone replies with a useful next step, usually within a couple of business days.
3. If it is a fit, you book time before you propose any work.

The form does not mention Zoho, Resend, or Calendly by name. Visitors do not need those words.

---

## A short list of “do not”

- Do not put the Resend key or the Zoho codes in `site-config.js` or in any HTML file.
- Do not turn Resend’s CNAME records orange in Cloudflare DNS.
- Do not upload a `node_modules` folder. This project does not have one, and it should stay that way.
- Do not delete `functions/api/contact.js` if you want the form to keep working. The pages can still be viewed without it, but the form will fail.

When something on the page should change, edit it on GitHub and commit. Cloudflare publishes the new version on its own.
