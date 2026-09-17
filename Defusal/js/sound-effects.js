// ===================================================================
// Sound Effects - lightweight synthesized SFX via Web Audio API
//
// No audio files needed - every sound is generated on the fly with
// oscillators, so this can just be dropped in as a new <script> tag
// loaded BEFORE defusal.js. Exposes a single global SFX object with
// one method per game event; defusal.js just calls SFX.playX() at
// the right moments (see integration notes).
// ===================================================================

const SFX = (function () {
    // Lazily created on first use - browsers block AudioContext
    // creation before a user gesture, so the first click/keypress in
    // the game creates it naturally; nothing needs to wait for that
    // explicitly.
    let audioContext = null;

    function getContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
        return audioContext;
    }

    // Plays one tone: frequency in Hz, duration in seconds, waveform
    // shape, peak volume (0-1). A short linear attack + exponential
    // decay keeps it from clicking/popping at the start or end.
    function playTone(frequency, duration, type, volume) {
        const ctx = getContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type || "square";
        oscillator.frequency.value = frequency;

        const now = ctx.currentTime;
        const peakVolume = volume || 0.15;

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(peakVolume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    // Plays a short list of tones back to back, for little
    // chime/fanfare effects made of 2-4 notes.
    function playSequence(notes) {
        let startDelay = 0;

        notes.forEach(function (note) {
            setTimeout(function () {
                playTone(note.frequency, note.duration, note.type, note.volume);
            }, startDelay * 1000);
            startDelay += note.duration;
        });
    }

    // ---------------- Custom audio file support ----------------
    // customBuffers maps an event name ("correct", "exploded", etc.)
    // to a decoded AudioBuffer, once loadCustomSound() has fetched
    // and decoded a real audio file for it. Events with no entry here
    // just keep using their synthesized tone - nothing else changes.
    const customBuffers = {};

    // Plays a decoded AudioBuffer through the same AudioContext (and
    // therefore the same volume handling) as the synthesized tones.
    function playBuffer(buffer, volume) {
        const ctx = getContext();
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        source.buffer = buffer;
        gainNode.gain.value = volume != null ? volume : 1;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(0);
    }

    // Fetches an audio file (mp3/wav/ogg all work) and decodes it
    // into an AudioBuffer, then stores it under `eventName`. From
    // then on, playing that event uses this clip instead of its
    // built-in synthesized tone. Call this once per sound you want to
    // swap in - e.g. right after the SFX object is created:
    //
    //   SFX.loadCustomSound("exploded", "../audio/explosion.mp3");
    //
    // Loading happens in the background; until it resolves (or if it
    // fails - missing file, bad format, etc.) the synthesized
    // fallback keeps playing, so a slow network never leaves a sound
    // silent.
    function loadCustomSound(eventName, url) {
        return fetch(url)
            .then(function (response) {
                return response.arrayBuffer();
            })
            .then(function (arrayBuffer) {
                return getContext().decodeAudioData(arrayBuffer);
            })
            .then(function (audioBuffer) {
                customBuffers[eventName] = audioBuffer;
            })
            .catch(function (error) {
                console.error(
                    "SFX: couldn't load custom sound \"" + eventName + "\" from " + url,
                    error
                );
            });
    }

    // Plays the custom clip for `eventName` if one's been loaded,
    // otherwise falls back to the synthesized sound. Every public
    // playX() method below is just this, wrapping its old body as
    // the fallback.
    function playWithFallback(eventName, fallbackFn, customVolume) {
        if (customBuffers[eventName]) {
            playBuffer(customBuffers[eventName], customVolume);
        } else {
            fallbackFn();
        }
    }

    return {
        // Registers a real audio file to replace one event's
        // synthesized tone. See loadCustomSound() above for details.
        // Valid eventName values match the play* methods below:
        // "keyTap", "correct", "wrong", "moduleSolved", "defused",
        // "exploded", "timerWarningTick".
        loadCustomSound: loadCustomSound,
        // Keypad tap / typing a character - short, quiet click
        playKeyTap: function () {
            playWithFallback("keyTap", function () {
                playTone(880, 0.03, "square", 0.06);
            });
        },

        // Correct answer - bright two-note ascending chime
        playCorrect: function () {
            playWithFallback("correct", function () {
                playSequence([
                    { frequency: 660, duration: 0.09, type: "sine", volume: 0.15 },
                    { frequency: 990, duration: 0.13, type: "sine", volume: 0.15 }
                ]);
            });
        },

        // Wrong answer / strike - low buzzy descending tone
        playWrong: function () {
            playWithFallback("wrong", function () {
                playSequence([
                    { frequency: 220, duration: 0.12, type: "sawtooth", volume: 0.18 },
                    { frequency: 140, duration: 0.18, type: "sawtooth", volume: 0.18 }
                ]);
            });
        },

        // One module fully solved
        playModuleSolved: function () {
            playWithFallback("moduleSolved", function () {
                playSequence([
                    { frequency: 523, duration: 0.10, type: "triangle", volume: 0.15 },
                    { frequency: 659, duration: 0.10, type: "triangle", volume: 0.15 },
                    { frequency: 784, duration: 0.20, type: "triangle", volume: 0.15 }
                ]);
            });
        },

        // Whole bomb defused - longer triumphant fanfare
        playDefused: function () {
            playWithFallback("defused", function () {
                playSequence([
                    { frequency: 523, duration: 0.12, type: "triangle", volume: 0.18 },
                    { frequency: 659, duration: 0.12, type: "triangle", volume: 0.18 },
                    { frequency: 784, duration: 0.12, type: "triangle", volume: 0.18 },
                    { frequency: 1047, duration: 0.35, type: "triangle", volume: 0.18 }
                ]);
            });
        },

        // Bomb exploded - harsh descending crash
        playExploded: function () {
            playWithFallback("exploded", function () {
                playSequence([
                    { frequency: 180, duration: 0.15, type: "sawtooth", volume: 0.20 },
                    { frequency: 120, duration: 0.15, type: "sawtooth", volume: 0.20 },
                    { frequency: 60, duration: 0.40, type: "sawtooth", volume: 0.22 }
                ]);
            });
        },

        // Countdown tick, meant for use once the timer is in its
        // "warning" state (under 30s)
        playTimerWarningTick: function () {
            playWithFallback("timerWarningTick", function () {
                playTone(1200, 0.05, "square", 0.08);
            });
        }
    };
})();