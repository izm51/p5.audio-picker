const AudioPicker = (() => {
  let _isMicAllowed = false;

  let _audioIn;
  let _audioSources;
  let _currentSource;

  const _Buttons = {
    buttons: [],
    createButtons: function (srcs, onPressed = () => {}) {
      this.buttons = srcs.map((src, i) => {
        const btn = createButton(src["label"], i.toString());
        btn.mousePressed(() => {
          this.removeButtons();
          onPressed(i);
        });
        return btn;
      });
      return this;
    },
    addStyleToButtons: function (elementMethods = () => {}) {
      /**
       * @param  {Func(button, index, length)} elementMethods
       * @return {this}
       */
      this.buttons.forEach((btn, i) => {
        elementMethods(btn, i, this.buttons.length);
      });
      return this;
    },
    removeButtons: function () {
      for (const btn of this.buttons) {
        btn.remove();
      }
      this.buttons = [];
    },
  };

  async function _getAudioSources() {
    getAudioContext().suspend();
    await await navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(() => {
        _isMicAllowed = true;
      })
      .catch((e) => {
        _isMicAllowed = false;
        throw e;
      });

    _audioIn = new p5.AudioIn();
    _audioSources = await _audioIn.getSources();

    return _audioSources;
  }

  function _setAudioSource(audioSourceIndex) {
    userStartAudio();
    _audioIn.setSource(audioSourceIndex);
    _audioIn.start();
    _currentSource = _audioSources[audioSourceIndex];
  }

  function _createButtons(onPressed = () => {}) {
    return _Buttons.createButtons(_audioSources, (i) => {
      _setAudioSource(i);
      onPressed();
    });
  }

  return {
    get isMicAllowed() {
      return _isMicAllowed;
    },
    get isPicked() {
      return !!_audioIn && !!_audioIn.currentSource;
    },
    get audioIn() {
      return _audioIn;
    },
    get currentSource() {
      return _currentSource();
    },
    getSources: _getAudioSources,
    setSource: _setAudioSource,
    createButtons: _createButtons,
  };
})();

p5.AudioPicker = AudioPicker;
