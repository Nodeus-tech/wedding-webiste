/* =========================================================
   WEDDING INVITATION
   INTERACTION / ANIMATION / COUNTDOWN / LIGHTBOX
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const body = document.body;

  const opening = document.getElementById("opening");
  const openingCard = document.getElementById("openingCard");
  const openButton = document.getElementById("openButton");

  const invitation = document.getElementById("invitation");

  const butterflyLayer =
    document.getElementById("butterflyLayer");

  const music =
    document.getElementById("weddingMusic");

  const lightbox =
    document.getElementById("lightbox");

  const lightboxImage =
    document.getElementById("lightboxImage");

  const lightboxClose =
    document.getElementById("lightboxClose");


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  let invitationOpened = false;
  let lightboxOpenedBy = null;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });


  /* =======================================================
     OPENING BUTTERFLIES
     ======================================================= */

  function createOpeningButterflies() {

    if (!butterflyLayer) return;

    butterflyLayer.innerHTML = "";

    const butterflyCount = 14;

    for (let i = 0; i < butterflyCount; i++) {

      const butterfly =
        document.createElement("span");

      butterfly.className = "butterfly";

      const startX =
        42 + Math.random() * 16;

      const startY =
        43 + Math.random() * 15;

      butterfly.style.left = `${startX}%`;
      butterfly.style.top = `${startY}%`;

      const directionX =
        (Math.random() - 0.5) * 2;

      const directionY =
        (Math.random() - 0.5) * 2;

      const distanceX =
        directionX * (180 + Math.random() * 260);

      const distanceY =
        directionY * (180 + Math.random() * 280);

      const scale =
        0.65 + Math.random() * 1.15;

      const rotation =
        -45 + Math.random() * 90;

      const duration =
        1.8 + Math.random() * 1.8;

      butterfly.style.setProperty(
        "--x",
        `${distanceX}px`
      );

      butterfly.style.setProperty(
        "--y",
        `${distanceY}px`
      );

      butterfly.style.setProperty(
        "--scale",
        scale
      );

      butterfly.style.setProperty(
        "--rot",
        `${rotation}deg`
      );

      butterfly.style.setProperty(
        "--duration",
        `${duration}s`
      );

      butterfly.style.animationDelay =
        `${Math.random() * 0.25}s`;

      butterflyLayer.appendChild(butterfly);

      requestAnimationFrame(() => {
        butterfly.classList.add("fly");
      });
    }
  }


  /* =======================================================
     MUSIC
     ======================================================= */

  function startMusic() {

    if (!music) return;

    try {

      music.volume = 0.65;

      const playPromise = music.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {

          console.info(
            "Wedding music could not start automatically."
          );

        });

      }

    } catch (error) {

      console.info(
        "Wedding music could not start.",
        error
      );

    }

  }


  /* =======================================================
     OPEN INVITATION
     ======================================================= */

  function openInvitation() {

    if (invitationOpened) return;

    invitationOpened = true;


    /* Disable opening button */

    if (openButton) {
      openButton.disabled = true;
    }


    /* Scroll to top */

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });


    /* Start music */

    startMusic();


    /* Create butterflies */

    createOpeningButterflies();


    /* =====================================
       STEP 1 — START COUPLE ANIMATION
       ===================================== */

    if (opening) {
      opening.classList.add("animate");
    }


    /* =====================================
       STEP 2 — COUPLE MEETS
       ===================================== */

    setTimeout(() => {

      if (opening) {
        opening.classList.add("meet");
      }

    }, 1400);


    /* =====================================
       STEP 3 — CLOSE OPENING SCREEN
       ===================================== */

    setTimeout(() => {

      if (opening) {
        opening.classList.add("is-closing");
      }

    }, 2600);


    /* =====================================
       STEP 4 — SHOW INVITATION
       ===================================== */

    setTimeout(() => {

      if (invitation) {
        invitation.classList.add("is-visible");
      }

      body.classList.remove(
        "invitation-locked"
      );

      body.classList.add(
        "invitation-opened"
      );

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });

    }, 3000);


    /* =====================================
       STEP 5 — REMOVE OPENING
       ===================================== */

    setTimeout(() => {

      if (opening) {
        opening.classList.add("is-hidden");
      }

    }, 3800);

  }


  /* =======================================================
     OPEN BY WAX SEAL
     ======================================================= */

  if (openButton) {

    openButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        openInvitation();

      }
    );

  }


  /* =======================================================
     OPEN BY CLICKING CARD
     ======================================================= */

  if (openingCard) {

    openingCard.addEventListener(
      "click",
      (event) => {

        if (
          event.target.closest("#openButton")
        ) {
          return;
        }

        openInvitation();

      }
    );


    /* Accessibility */

    openingCard.setAttribute(
      "role",
      "button"
    );

    openingCard.setAttribute(
      "tabindex",
      "0"
    );

    openingCard.setAttribute(
      "aria-label",
      "Touch to open wedding invitation"
    );


    /* Keyboard */

    openingCard.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openInvitation();

        }

      }
    );

  }


  /* =======================================================
     COUNTDOWN
     ======================================================= */

  const weddingDate =
    new Date("2027-01-02T11:00:00+05:30");


  function updateCountdown() {

    const now = new Date();

    const difference =
      weddingDate.getTime() -
      now.getTime();


    const daysElement =
      document.getElementById("days");

    const hoursElement =
      document.getElementById("hours");

    const minutesElement =
      document.getElementById("minutes");

    const secondsElement =
      document.getElementById("seconds");


    if (
      !daysElement ||
      !hoursElement ||
      !minutesElement ||
      !secondsElement
    ) {
      return;
    }


    if (difference <= 0) {

      daysElement.textContent = "000";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      return;
    }


    const totalSeconds =
      Math.floor(difference / 1000);


    const days =
      Math.floor(totalSeconds / 86400);

    const hours =
      Math.floor(
        (totalSeconds % 86400) / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    const seconds =
      totalSeconds % 60;


    daysElement.textContent =
      String(days).padStart(3, "0");

    hoursElement.textContent =
      String(hours).padStart(2, "0");

    minutesElement.textContent =
      String(minutes).padStart(2, "0");

    secondsElement.textContent =
      String(seconds).padStart(2, "0");

  }


  updateCountdown();

  setInterval(
    updateCountdown,
    1000
  );


  /* =======================================================
     GALLERY LIGHTBOX
     ======================================================= */

  const galleryCards =
    document.querySelectorAll(".gallery-card");


  function openLightbox(card) {

    if (
      !lightbox ||
      !lightboxImage ||
      !card
    ) {
      return;
    }


    /* Find image inside clicked card */

    const image =
      card.querySelector("img");


    if (!image) return;


    /* Remember clicked card */

    lightboxOpenedBy = card;


    /* Use same image */

    lightboxImage.src = image.currentSrc || image.src;

    lightboxImage.alt =
      image.alt || "Expanded wedding gallery photo";


    /* Open */

    lightbox.classList.add("is-open");

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );


    /* Lock background scroll */

    body.classList.add("lightbox-open");


    /* Focus close button */

    setTimeout(() => {

      if (lightboxClose) {
        lightboxClose.focus();
      }

    }, 50);

  }


  function closeLightbox() {

    if (!lightbox) return;


    lightbox.classList.remove("is-open");

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );


    /* Unlock background */

    body.classList.remove("lightbox-open");


    /* Return focus */

    if (lightboxOpenedBy) {

      lightboxOpenedBy.focus();

    }


    /* Clear image after animation */

    setTimeout(() => {

      if (
        lightboxImage &&
        !lightbox.classList.contains("is-open")
      ) {

        lightboxImage.src = "";
        lightboxImage.alt = "";

      }

    }, 300);

  }


  /* =======================================================
     OPEN GALLERY IMAGE
     ======================================================= */

  galleryCards.forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        openLightbox(card);

      }
    );

  });


  /* =======================================================
     CLOSE BUTTON
     ======================================================= */

  if (lightboxClose) {

    lightboxClose.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        closeLightbox();

      }
    );

  }


  /* =======================================================
     CLICK OUTSIDE IMAGE
     ======================================================= */

  if (lightbox) {

    lightbox.addEventListener(
      "click",
      (event) => {

        /* Close only when clicking backdrop */

        if (event.target === lightbox) {

          closeLightbox();

        }

      }
    );

  }


  /* =======================================================
     ESC KEY
     ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        lightbox &&
        lightbox.classList.contains("is-open")
      ) {

        closeLightbox();

      }

    }
  );


  /* =======================================================
     ENSURE INITIAL STATE
     ======================================================= */

  if (opening) {

    opening.classList.remove(
      "is-closing",
      "is-hidden",
      "animate",
      "meet"
    );

  }


  if (invitation) {

    invitation.classList.remove(
      "is-visible"
    );

  }


  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

});