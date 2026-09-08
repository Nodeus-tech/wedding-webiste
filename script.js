(() => {

  "use strict";


  /* =========================================================
     ELEMENTS
  ========================================================= */

  const entrance =
    document.getElementById("entrance");

  const website =
    document.getElementById("website");

  const openButton =
    document.getElementById("open-invitation");

  const musicButton =
    document.getElementById("music-toggle");

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  /* =========================================================
     INITIAL STATE
  ========================================================= */

  entrance.hidden = false;

  document.body.classList.add("sealed");

  website.inert = true;

  openButton.focus();


  /* =========================================================
     AUDIO
  ========================================================= */

  let audioContext;
  let masterGain;
  let melodyTimer;
  let musicOn = false;
  let opening = false;


  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;


  const melody = [
    523.25,
    659.25,
    783.99,
    659.25,
    587.33,
    698.46,
    880,
    698.46,
    493.88,
    587.33,
    783.99,
    587.33,
    523.25,
    659.25,
    783.99,
    1046.5
  ];


  /* =========================================================
     PLAY MELODY PHRASE
  ========================================================= */

  function playPhrase() {

    if (
      !audioContext ||
      !musicOn
    ) {
      return;
    }


    const start =
      audioContext.currentTime + 0.08;


    melody.forEach(
      (frequency, index) => {

        const oscillator =
          audioContext.createOscillator();

        const envelope =
          audioContext.createGain();

        const time =
          start + index * 0.65;


        oscillator.type = "sine";

        oscillator.frequency.value =
          frequency;


        envelope.gain.setValueAtTime(
          0,
          time
        );


        envelope.gain.linearRampToValueAtTime(
          0.09,
          time + 0.025
        );


        envelope.gain.exponentialRampToValueAtTime(
          0.0001,
          time + 2.4
        );


        oscillator.connect(
          envelope
        );

        envelope.connect(
          masterGain
        );


        oscillator.start(time);

        oscillator.stop(
          time + 2.5
        );


        oscillator.onended = () => {

          oscillator.disconnect();

          envelope.disconnect();

        };

      }
    );

  }


  /* =========================================================
     MUSIC BUTTON
  ========================================================= */

  function updateMusicButton() {

    musicButton.textContent =
      musicOn
        ? "Music on"
        : "Music off";


    musicButton.setAttribute(
      "aria-pressed",
      String(musicOn)
    );


    musicButton.setAttribute(
      "aria-label",
      musicOn
        ? "Turn music off"
        : "Turn music on"
    );

  }


  /* =========================================================
     START MUSIC
  ========================================================= */

  async function startMusic() {

    if (!AudioContextClass) {
      return;
    }


    try {

      if (!audioContext) {

        audioContext =
          new AudioContextClass();


        masterGain =
          audioContext.createGain();


        masterGain.gain.value =
          0;


        masterGain.connect(
          audioContext.destination
        );

      }


      await audioContext.resume();


      musicOn = true;


      masterGain.gain.cancelScheduledValues(
        audioContext.currentTime
      );


      masterGain.gain.setTargetAtTime(
        0.5,
        audioContext.currentTime,
        0.2
      );


      clearInterval(
        melodyTimer
      );


      playPhrase();


      melodyTimer =
        setInterval(
          playPhrase,
          melody.length * 650
        );

    }

    catch {

      musicOn = false;

    }


    updateMusicButton();

  }


  /* =========================================================
     STOP MUSIC
  ========================================================= */

  function stopMusic() {

    musicOn = false;

    clearInterval(
      melodyTimer
    );


    if (
      audioContext &&
      masterGain
    ) {

      masterGain.gain.cancelScheduledValues(
        audioContext.currentTime
      );


      masterGain.gain.setTargetAtTime(
        0,
        audioContext.currentTime,
        0.08
      );

    }


    updateMusicButton();

  }


  /* =========================================================
     CREATE FLYING BUTTERFLY
  ========================================================= */

  function createButterfly() {

    const butterfly =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );


    butterfly.setAttribute(
      "viewBox",
      "0 0 120 120"
    );


    butterfly.setAttribute(
      "aria-hidden",
      "true"
    );


    butterfly.classList.add(
      "flying-butterfly"
    );


    const use =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
      );


    use.setAttribute(
      "href",
      "#butterfly"
    );


    butterfly.appendChild(
      use
    );


    return butterfly;

  }


  /* =========================================================
     RELEASE BUTTERFLIES
  ========================================================= */

  function releaseButterflies() {

    if (reducedMotion.matches) {
      return;
    }


    const amount =
      window.innerWidth < 700
        ? 14
        : 22;


    for (
      let i = 0;
      i < amount;
      i++
    ) {

      const butterfly =
        createButterfly();


      const angle =
        (i / amount) *
        Math.PI *
        2;


      const distance =
        Math.max(
          window.innerWidth,
          window.innerHeight
        ) *
        (
          0.55 +
          Math.random() * 0.45
        );


      const horizontal =
        Math.cos(angle) *
        distance *
        (0.65 + Math.random() * 0.55);


      const vertical =
        Math.sin(angle) *
        distance *
        (0.65 + Math.random() * 0.45) -
        90;


      butterfly.style.setProperty(
        "--x",
        `${horizontal}px`
      );


      butterfly.style.setProperty(
        "--y",
        `${vertical}px`
      );


      butterfly.style.setProperty(
        "--r",
        `${Math.random() * 240 - 120}deg`
      );


      butterfly.style.setProperty(
        "--scale",
        `${0.75 + Math.random() * 1.25}`
      );


      butterfly.style.animationDelay =
        `${Math.random() * 0.65}s`;


      const size =
        52 +
        Math.random() * 50;


      butterfly.style.width =
        `${size}px`;


      butterfly.style.height =
        `${size}px`;


      document.body.appendChild(
        butterfly
      );


      butterfly.addEventListener(
        "animationend",
        event => {

          if (
            event.animationName ===
            "fly-away"
          ) {

            butterfly.remove();

          }

        }
      );

    }

  }


  /* =========================================================
     RELEASE PETALS
  ========================================================= */

  function releasePetals() {

    if (reducedMotion.matches) {
      return;
    }


    const amount =
      window.innerWidth < 700
        ? 18
        : 32;


    for (
      let i = 0;
      i < amount;
      i++
    ) {

      const petal =
        document.createElement("span");


      petal.className =
        "falling-petal";


      petal.style.left =
        `${Math.random() * 100}%`;


      petal.style.setProperty(
        "--duration",
        `${3 + Math.random() * 3}s`
      );


      petal.style.setProperty(
        "--drift",
        `${Math.random() * 260 - 130}px`
      );


      petal.style.setProperty(
        "--rotation",
        `${Math.random() * 720 - 360}deg`
      );


      petal.style.animationDelay =
        `${Math.random() * 0.8}s`;


      const size =
        8 +
        Math.random() * 10;


      petal.style.width =
        `${size}px`;


      petal.style.height =
        `${size * 1.5}px`;


      document.body.appendChild(
        petal
      );


      petal.addEventListener(
        "animationend",
        () => petal.remove()
      );

    }

  }


  /* =========================================================
     OPEN INVITATION
  ========================================================= */

  openButton.addEventListener(
    "click",
    () => {

      if (opening) {
        return;
      }


      opening = true;


      openButton.disabled =
        true;


      /*
        Butterflies and petals are released
        exactly when the invitation is opened.
      */

      releaseButterflies();

      releasePetals();


      musicButton.hidden =
        !AudioContextClass;


      void startMusic();


      /*
        Give the butterflies a brief moment
        before fading away the entrance.
      */

      setTimeout(
        () => {

          entrance.classList.add(
            "opened"
          );

        },
        180
      );


      website.inert = false;


      document.body.classList.remove(
        "sealed"
      );


      document
        .getElementById("home")
        .focus({
          preventScroll: true
        });


      setTimeout(
        () => {

          entrance.remove();

        },
        reducedMotion.matches
          ? 0
          : 1500
      );

    }
  );


  /* =========================================================
     MUSIC TOGGLE
  ========================================================= */

  musicButton.addEventListener(
    "click",
    () => {

      if (musicOn) {
        stopMusic();
      }

      else {
        void startMusic();
      }

    }
  );


  /* =========================================================
     COUNTDOWN
  ========================================================= */

  /*
    Wedding ceremony:
    January 2, 2027
    11:00 AM
    India Standard Time
  */

  const weddingTime =
    new Date(
      "2027-01-02T11:00:00+05:30"
    ).getTime();


  const countdownParts = [
    "days",
    "hours",
    "minutes",
    "seconds"
  ].map(
    id =>
      document.getElementById(id)
  );


  function updateCountdown() {

    const remaining =
      Math.max(
        0,
        weddingTime - Date.now()
      );


    const totalSeconds =
      Math.floor(
        remaining / 1000
      );


    const values = [

      Math.floor(
        totalSeconds / 86400
      ),

      Math.floor(
        totalSeconds / 3600
      ) % 24,

      Math.floor(
        totalSeconds / 60
      ) % 60,

      totalSeconds % 60

    ];


    values.forEach(
      (value, index) => {

        countdownParts[index]
          .textContent =
          String(value)
            .padStart(2, "0");

      }
    );


    if (!remaining) {

      document
        .getElementById(
          "countdown-title"
        )
        .textContent =
        "Our forever has begun";

    }

  }


  updateCountdown();


  setInterval(
    updateCountdown,
    1000
  );


  /* =========================================================
     SCROLL REVEALS
  ========================================================= */

  if (
    "IntersectionObserver" in window &&
    !reducedMotion.matches
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target
                  .classList
                  .remove(
                    "pending"
                  );


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.1
        }
      );


    document
      .querySelectorAll(
        ".reveal"
      )
      .forEach(
        section => {

          section.classList.add(
            "pending"
          );


          observer.observe(
            section
          );

        }
      );

  }


  /* =========================================================
     STOP MUSIC WHEN TAB IS HIDDEN
  ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden &&
        musicOn
      ) {

        stopMusic();

      }

    }
  );

})();