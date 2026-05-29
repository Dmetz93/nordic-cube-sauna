/* Nordic Cube interactions */
(function () {
  // ---------- Loader ----------
  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      const loader = document.querySelector(".loader");
      if (loader) setTimeout(() => loader.classList.add("hidden"), 200);
    });
  });

  // ---------- Header scrolled state ----------
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const toggle = document.querySelector(".menu-toggle");
  const closeMenuOnLinks = document.querySelectorAll(".mobile-menu a");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
  }
  closeMenuOnLinks.forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // ---------- Offerte formulier ----------
  const form = document.querySelector("#offerte-form");
  if (form) {
    const msg = form.querySelector(".form-message");
    const submitBtn = form.querySelector(".btn-submit");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.classList.remove("show", "error");

      const data = new FormData(form);
      const naam = (data.get("naam") || "").trim();
      const email = (data.get("email") || "").trim();
      const telefoon = (data.get("telefoon") || "").trim();
      const adres = (data.get("adres") || "").trim();
      const montage = data.get("montage") || "n.v.t.";
      const bericht = (data.get("bericht") || "").trim();

      if (!naam || !email) {
        msg.textContent = "Vul minimaal je naam en e-mailadres in.";
        msg.classList.add("show", "error");
        return;
      }

      // 1. Probeer Web3Forms (gratis form-backend) als er een ACCESS_KEY ingevuld is
      const accessKey = form.dataset.web3formsKey;
      const useWeb3 = accessKey && accessKey.length > 10;

      if (useWeb3) {
        try {
          submitBtn.disabled = true;
          submitBtn.querySelector("span").textContent = "Versturen...";
          const payload = {
            access_key: accessKey,
            subject: `Nieuwe offerte-aanvraag van ${naam}`,
            from_name: "Nordic Cube Website",
            reply_to: email,
            naam, email, telefoon, adres, montage, bericht,
          };
          const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          });
          const json = await res.json();
          if (json.success) {
            form.reset();
            msg.textContent = "Bedankt! We nemen binnen 2 werkdagen contact met je op.";
            msg.classList.add("show");
            submitBtn.querySelector("span").textContent = "Verzonden";
            return;
          }
          throw new Error(json.message || "Verzenden mislukt");
        } catch (err) {
          msg.textContent = "Er ging iets mis bij het verzenden. We openen je e-mailprogramma als alternatief...";
          msg.classList.add("show", "error");
        } finally {
          submitBtn.disabled = false;
          if (submitBtn.querySelector("span").textContent === "Versturen...") {
            submitBtn.querySelector("span").textContent = "Verstuur aanvraag";
          }
        }
      }

      // 2. Fallback: open mailto met vooringevulde gegevens
      const subject = encodeURIComponent(`Offerte-aanvraag van ${naam}`);
      const body = encodeURIComponent(
        `Naam: ${naam}\nE-mail: ${email}\nTelefoon: ${telefoon}\nAdres: ${adres}\nMontage-optie: ${montage}\n\nBericht:\n${bericht}\n\nVerzonden via nordiccubesauna.nl`
      );
      window.location.href = `mailto:info@nordiccubesauna.nl?subject=${subject}&body=${body}`;
      if (!useWeb3) {
        msg.textContent = "Je e-mailprogramma wordt geopend. Verstuur de mail om je aanvraag af te ronden.";
        msg.classList.add("show");
      }
    });
  }
})();
