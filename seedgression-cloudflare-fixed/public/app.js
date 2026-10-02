(function () {
  var cfg = window.SEED || {};

  function menu() {
    var button = document.querySelector(".menu-btn");
    var nav = document.getElementById("mobile-nav");
    if (!button || !nav) return;
    button.addEventListener("click", function () {
      var open = nav.hasAttribute("hidden");
      if (open) nav.removeAttribute("hidden");
      else nav.setAttribute("hidden", "");
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  function tabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-tab]"));
      var panels = Array.prototype.slice.call(root.querySelectorAll("[data-panel]"));
      function show(id) {
        buttons.forEach(function (button) {
          button.setAttribute("aria-selected", button.getAttribute("data-tab") === id ? "true" : "false");
        });
        panels.forEach(function (panel) {
          if (panel.getAttribute("data-panel") === id) panel.removeAttribute("hidden");
          else panel.setAttribute("hidden", "");
        });
      }
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          show(button.getAttribute("data-tab"));
        });
      });
      if (buttons[0]) show(buttons[0].getAttribute("data-tab"));
    });
  }

  function flight() {
    var video = document.querySelector(".flight-media");
    if (!video || video.tagName !== "VIDEO") return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      var img = document.createElement("img");
      img.className = "flight-media";
      img.alt = "";
      img.src = "/media/flight-poster.jpg";
      video.replaceWith(img);
      return;
    }
    video.addEventListener("ended", function () {
      video.currentTime = 1.4;
      var play = video.play();
      if (play && play.catch) play.catch(function () {});
    });
  }

  function calendlyUrl(raw) {
    try {
      var url = new URL(raw);
      if (!url.searchParams.has("background_color")) url.searchParams.set("background_color", "f6f8f7");
      if (!url.searchParams.has("text_color")) url.searchParams.set("text_color", "073f54");
      if (!url.searchParams.has("primary_color")) url.searchParams.set("primary_color", "2c58a8");
      return url.toString();
    } catch (error) {
      return raw;
    }
  }

  function calendly() {
    var slot = document.querySelector("[data-calendly]");
    if (!slot || !cfg.calendlyUrl) return;
    var widget = document.createElement("div");
    widget.className = "calendly-inline-widget";
    widget.setAttribute("data-url", calendlyUrl(cfg.calendlyUrl));
    widget.style.minWidth = "280px";
    widget.style.height = "720px";
    slot.appendChild(widget);
    var note = document.querySelector("[data-calendly-note]");
    if (note) note.removeAttribute("hidden");
    var script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }

  function plans() {
    if (cfg.showPlans !== false) return;
    var section = document.getElementById("plans");
    if (section) section.remove();
    document.querySelectorAll("[data-plans-link]").forEach(function (link) {
      link.remove();
    });
  }

  function email() {
    if (!cfg.publicEmail) return;
    document.querySelectorAll("[data-public-email]").forEach(function (node) {
      var link = document.createElement("a");
      link.href = "mailto:" + cfg.publicEmail;
      link.textContent = cfg.publicEmail;
      node.appendChild(document.createTextNode(" · "));
      node.appendChild(link);
    });
  }

  function showErrors(form, errors) {
    form.querySelectorAll(".err").forEach(function (node) {
      node.remove();
    });
    form.querySelectorAll("[aria-invalid]").forEach(function (field) {
      field.removeAttribute("aria-invalid");
    });
    Object.keys(errors || {}).forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (!field) return;
      field.setAttribute("aria-invalid", "true");
      var note = document.createElement("span");
      note.className = "err";
      note.textContent = errors[name];
      field.parentElement.appendChild(note);
    });
  }

  function enquiry() {
    var form = document.querySelector("[data-enquiry]");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = form.querySelector("button[type=submit]");
      var banner = form.querySelector(".banner");
      if (banner) banner.remove();
      var data = {
        name: form.name.value,
        email: form.email.value,
        company: form.company.value,
        message: form.message.value,
        times: form.times.value,
        fax: form.fax.value
      };
      button.disabled = true;
      button.textContent = "Sending…";
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          return response.json().then(function (body) {
            return { ok: response.ok, body: body };
          });
        })
        .then(function (result) {
          var body = result.body || {};
          if (body.ok) {
            var success = document.createElement("div");
            success.className = "success";
            success.setAttribute("role", "status");
            success.innerHTML = "<h2>We have it.</h2><p></p>";
            success.querySelector("p").textContent = body.message;
            form.replaceWith(success);
            return;
          }
          showErrors(form, body.fieldErrors);
          if (!body.fieldErrors) {
            var alert = document.createElement("p");
            alert.className = "banner";
            alert.setAttribute("role", "alert");
            alert.textContent = body.message || "We could not send that just now. Please try again in a moment.";
            form.prepend(alert);
          }
          button.disabled = false;
          button.textContent = "Send the note";
        })
        .catch(function () {
          var alert = document.createElement("p");
          alert.className = "banner";
          alert.setAttribute("role", "alert");
          alert.textContent = "We could not send that just now. Please try again in a moment.";
          form.prepend(alert);
          button.disabled = false;
          button.textContent = "Send the note";
        });
    });
  }

  menu();
  tabs();
  flight();
  calendly();
  plans();
  email();
  enquiry();
})();
