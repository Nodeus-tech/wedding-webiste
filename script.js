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
     OPENING STATE
     ======================================================= */

  let invitationOpened = false;


  /* =======================================================
     PREVENT PAGE FROM SHOWING SCROLL POSITION ON LOAD
     ======================================================= */

  window.scrollTo(0, 0);


  /* =======================================================
     BUTTERFLY CREATION
     ======================================================= */

  function createOpeningButterflies() {

    if (!butterflyLayer) {
      return;
    }

    butterflyLayer.innerHTML = "";

    const butterflyCount = 14;

    for (let i = 0; i < butterflyCount; i++) {

      const butterfly =
        document.createElement("span");

      butterfly.className = "butterfly";

      /*
       * Start position is around the center/card area.
       * Slight randomness makes every butterfly feel natural.
       */

      const startX =
        42 + Math.random() * 16;

      const startY =
        43 + Math.random() * 15;

      butterfly.style.left = `${startX}%`;
      butterfly.style.top = `${startY}%`;

      /*
       * Random flight direction
       */

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

      /*
       * Different animation delays make the butterflies
       * leave naturally rather than all at exactly once.
       */

      butterfly.style.animationDelay =
        `${Math.random() * 0.25}s`;

      butterflyLayer.appendChild(butterfly);

      /*
       * Trigger animation on next frame.
       */

      requestAnimationFrame(() => {
        butterfly.classList.add("fly");
      });
    }
  }


  /* =======================================================
     START MUSIC
     ======================================================= */

  function startMusic() {

    if (!music) {
      return;
    }

    try {

      music.volume = 0.65;

      const playPromise =
        music.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {

          /*
           * Some browsers can still block playback.
           * This is normal and doesn't break the invitation.
           */

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

    /*
     * Prevent double activation.
     */

    if (invitationOpened) {
      return;
    }

    invitationOpened = true;


    /*
     * Disable button immediately.
     */

    if (openButton) {
      openButton.disabled = true;
    }


    /*
     * Make sure the page is at the top.
     */

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });


    /*
     * 1. Start butterflies.
     */

    createOpeningButterflies();


    /*
     * 2. Start music from the user interaction.
     */

    startMusic();


    /*
     * 3. Slight pause before the opening starts
     *    disappearing. This gives the butterflies a moment
     *    to appear.
     */

    setTimeout(() => {

      opening.classList.add("is-closing");

    }, 120);


    /*
     * 4. Reveal the main wedding website.
     */

    setTimeout(() => {

      invitation.classList.add("is-visible");

      /*
       * Unlock page scrolling.
       */

      body.classList.remove(
        "invitation-locked"
      );

      body.classList.add(
        "invitation-opened"
      );


      /*
       * Make absolutely sure the website starts
       * at the Hero / top.
       */

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });

    }, 650);


    /*
     * 5. Completely remove the opening from interaction
     *    after its fade animation has finished.
     */

    setTimeout(() => {

      opening.classList.add("is-hidden");

    }, 1350);

  }


  /* =======================================================
     OPEN BY WAX SEAL
     ======================================================= */

  if (openButton) {

    openButton.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        openInvitation();

      }
    );

  }


  /* =======================================================
     OPEN BY TOUCHING / CLICKING ANYWHERE ON CARD
     ======================================================= */

  if (openingCard) {

    openingCard.addEventListener(
      "click",
      (event) => {

        /*
         * If wax seal was clicked, its own listener
         * already handles the action.
         */

        if (
          event.target.closest("#openButton")
        ) {
          return;
        }

        openInvitation();

      }
    );


    /*
     * Accessibility
     */

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


    /*
     * Keyboard accessibility
     */

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
    new Date(
      "2027-04-18T16:30:00+05:00"
    );


  function updateCountdown() {

    const now =
      new Date();

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
      Math.floor(
        difference / 1000
      );


    const days =
      Math.floor(
        totalSeconds / 86400
      );

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
    document.querySelectorAll(
      ".gallery-card[data-lightbox]"
    );


  function openLightbox(imageSrc) {

    if (
      !lightbox ||
      !lightboxImage
    ) {
      return;
    }

    lightboxImage.src =
      imageSrc;

    lightbox.classList.add(
      "is-open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    body.classList.add(
      "lightbox-open"
    );

  }


  function closeLightbox() {

    if (!lightbox) {
      return;
    }

    lightbox.classList.remove(
      "is-open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    body.classList.remove(
      "lightbox-open"
    );

    /*
     * Clear image after transition.
     */

    setTimeout(() => {

      if (
        !lightbox.classList.contains(
          "is-open"
        )
      ) {

        lightboxImage.src = "";

      }

    }, 300);

  }


  galleryCards.forEach(
    (card) => {

      card.addEventListener(
        "click",
        () => {

          const imageSrc =
            card.dataset.lightbox;

          if (imageSrc) {
            openLightbox(
              imageSrc
            );
          }

        }
      );

    }
  );


  if (lightboxClose) {

    lightboxClose.addEventListener(
      "click",
      closeLightbox
    );

  }


  /*
   * Clicking outside image closes lightbox.
   */

  if (lightbox) {

    lightbox.addEventListener(
      "click",
      (event) => {

        if (
          event.target === lightbox
        ) {
          closeLightbox();
        }

      }
    );

  }


  /*
   * ESC closes lightbox.
   */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        lightbox &&
        lightbox.classList.contains(
          "is-open"
        )
      ) {

        closeLightbox();

      }

    }
  );


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  /*
   * Keep opening visible.
   */

  if (opening) {
    opening.classList.remove(
      "is-closing",
      "is-hidden"
    );
  }


  /*
   * Keep invitation hidden until opening.
   */

  if (invitation) {
    invitation.classList.remove(
      "is-visible"
    );
  }


  /*
   * Ensure the page starts at top.
   */

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

});