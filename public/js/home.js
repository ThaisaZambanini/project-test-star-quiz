;(function ($) {
  'use strict'

  function init () {
    configButtonStart()
  }

  function configButtonStart () {
     $('#startGame').on('click', function(){
       window.location.href = '/game'
     })
   }

  init()

})(window.$)
