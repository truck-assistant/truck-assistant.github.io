let processor = {
  timerCallback: function() {
    if (this.v1.paused || this.v1.ended) {
      return
    }
    this.computeFrame()
    setTimeout((() => {
      this.timerCallback()
    }).bind(this), 0)
  },

  loadImages: function() {
    this.chatL = document.querySelector('img.chatL')
    this.chat = []
    let imageNodes = document.querySelectorAll('img.chat:not(.chatL)')
    for (let i = 0; i < imageNodes.length; i++) {
      this.chat.push(imageNodes[i])
    }
    this.chatWidth = 500
  },

  loadAudio: function () {
    this.audio = document.querySelector('audio')

    this.dialogs = [
      {
        start: 5,
        duration: 10
      },
      {
        start: 15.5,
        duration: 5
      },
      {
        start: 23,
        duration: 13
      },
      {
        start: 36,
        duration: 3
      },
      {
        start: 67,
        duration: 7
      }
    ]
  },

  playDialog(dialog, speed) {
    console.log('play dialog')
    this.audio.currentTime = dialog.start
    this.audio.playbackRate = speed
    this.audio.play()
    this.audio.ontimeupdate = () => {
      if (this.audio.currentTime >= dialog.start + dialog.duration) {
        this.audio.pause()
        console.log('stop dialog')
      }
    }
  },

  loadVideos: function() {
    this.v1 = document.querySelector('.v1')
    this.v2 = document.querySelector('.v2')
    this.canvas = document.querySelector('.canvas')
    this.ctx = this.canvas.getContext('2d')

    this.vWidth = this.v1.videoWidth / 3
    this.vHeight = this.v1.videoHeight / 3
    this.frame = 0
    this.v1.volume = 0.2
  },

  doLoad: function() {
    this.loadImages()

    this.loadAudio()

    this.loadVideos()
    
    this.canvas.width = this.vWidth + this.chatWidth
    this.canvas.height = this.vHeight * 2

    this.events = [
      {
        frame: 1,
        dialog: 0,
        speed: 1
      },
      {
        frame: 2,
        dialog: 1,
        speed: 1.2
      },
      {
        frame: 3,
        dialog: 2,
        speed: 1
      },
      {
        frame: 4,
        dialog: 3,
        speed: 1.2
      },
      {
        frame: 5,
        dialog: 4,
        speed: 1
      }
    ]

    currentEvent = -1

    this.v1.addEventListener('timeupdate', (() => {
      if (this.v1.currentTime >= 24) {
        this.v1.pause()
      }
      if (this.audio.paused) {
        if (this.v1.currentTime >= 4 && this.v1.currentTime <= 5) {
          currentEvent = 0
        }
        if (currentEvent >= 0) { 
          this.frame = this.events[currentEvent].frame
          this.playDialog(this.dialogs[this.events[currentEvent].dialog], this.events[currentEvent].speed)
          currentEvent ++
        }
        if (currentEvent >= this.events.length) {
          setTimeout(() => {
            this.v1.pause()
            this.v2.pause()
          }, 4000)
        }
      }
    }).bind(this))

    this.v2.addEventListener('timeupdate', (() => {
      if (this.v2.currentTime >= 6) {
        this.v2.playbackRate = 0.5
      }
    }).bind(this))

    this.v1.currentTime = 68
    this.v1.playbackRate = 0.5
    this.v2.currentTime = .75
    this.v1.play()
    this.v2.play()
    this.timerCallback()
  },

  computeFrame: function() {
    this.ctx.drawImage(this.v1, 0, 0, this.vWidth, this.vHeight)
    this.ctx.drawImage(this.v2, 0, this.vHeight, this.vWidth, this.vHeight)
    this.ctx.drawImage(this.chat[this.frame], this.vWidth, 0, this.chatWidth, this.vHeight * 2)
  }
}
