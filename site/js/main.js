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
    const submitLabel = submitBtn.querySelector("span");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      msg.classList.remove("show", "error");

      const data = new FormData(form);
      const naam = (data.get("naam") || "").trim();
      const email = (data.get("email") || "").trim();
      const telefoon = (data.get("telefoon") || "").trim();
      const adres = (data.get("adres") || "").trim();
      const montage = data.get("montage") || "n.v.t.";
      const bericht = (data.get("bericht") || "").trim();
      const honey = (data.get("bot-trap") || "").trim();

      if (honey) return;
      if (!naam || !email) {
        msg.textContent = "Vul minimaal je naam en e-mailadres in.";
        msg.classList.add("show", "error");
        return;
      }

      const subject = encodeURIComponent(`Offerte-aanvraag van ${naam}`);
      const body = encodeURIComponent(
        `Naam: ${naam}\nE-mail: ${email}\nTelefoon: ${telefoon || "n.v.t."}\nAdres: ${adres || "n.v.t."}\nMontage-optie: ${montage}\n\nBericht:\n${bericht || "(geen bericht)"}\n\nVerzonden via nordiccubesauna.nl`
      );
      window.location.href = `mailto:info@nordiccubesauna.nl?subject=${subject}&body=${body}`;
      submitLabel.textContent = "Mail geopend";
      msg.textContent = "Je mailprogramma is geopend met de aanvraag. Klik op verzenden om hem te versturen.";
      msg.classList.add("show");
    });
  }
})();
