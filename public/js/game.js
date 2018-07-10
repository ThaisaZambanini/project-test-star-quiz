;(function ($) {
  'use strict'

  var query = {
    modal: {
      answer: $('#inputModal'),
      details: $('#detailsModal'),
      finish: $('#finishModal')
    },
    personDetails: {
      specie: $('#specie'),
      height: $('#height'),
      hair: $('#hair'),
      imgPersonModal: $('#imgPersonModal'),
      planet: $('#planet'),
      movies: $('#movies'),
      vehicles: $('#vehicles')
    },
    template: {
      cssLi: 'card-wars__item align-items-center flex-md-column',
      img: {
        css: 'card-wars__item__img'
      }
    },
    images: [{id:1, img:'https://guides.gamepressure.com/starwarsbattlefront/gfx/word/80697133.jpg'},
      {id:2, img:'http://icons.iconarchive.com/icons/jonathan-rey/star-wars-characters/256/C3PO-icon.png'},
      {id:3, img:'https://vignette.wikia.nocookie.net/disney/images/f/f2/R2-D2_Figure.png/revision/latest?cb=20151211101344'},
      {id:4, img:'https://vignette.wikia.nocookie.net/unanything/images/f/f7/Darth_Vader.png/revision/latest?cb=20110710233331'},
      {id:5, img:'https://clipart.info/images/ccovers/1513358463Princess%20Leia%20Carrie%20Fisher%20Smiling%20transparent%20PNG.png'},
      {id:6, img:'https://vignette.wikia.nocookie.net/starwars/images/e/eb/OwenCardTrader.png/revision/latest?cb=20171108050140'},
      {id:7, img:'https://vignette.wikia.nocookie.net/starwars/images/c/cc/BeruCardTrader.png/revision/latest?cb=20170713063118'},
      {id:8, img:'https://i.pinimg.com/originals/d2/39/af/d239af96f6d418d4873cdc3cbbc7afcf.png'},
      {id:9, img:'https://vignette.wikia.nocookie.net/starwars/images/0/00/BiggsHS-ANH.png/revision/latest?cb=20130305010406'},
      {id:10, img:'https://3.bp.blogspot.com/-e6mpG2aUwXo/V1Lr2AhNkhI/AAAAAAAAEx8/g80esaEBlZMFS_UFUHSt5D6RJJimkhTjACLcB/w1200-h630-p-k-no-nu/obiwah.png'}],
    keyStorage: 'quizStarUsers',
    user: [],
    point: 0
  }

  function init () {
    createTemplateDynamic()
    setPagination()
    listenerButtonDetails()
    listenerButtonInput()
    listenerButtonModalInput()
    listenerButtonModalFinish()
    setTimer()
  }

  function setTimer() {
    var timer = new Timer({timer: 1}, function() {
      finish()
    })
  }

  function setPagination(){
    $('.card-wars').paginathing({
      perPage: 8,
      prevNext: true,
      firstLast: true,
      prevText: '&laquo;',
      nextText: '&raquo;',
      firstText: 'Primeiro',
      lastText: 'Último'
    })
  }

  function listenerButtonInput() {
    $('.btn-input').on('click', function() {
      var id =  $(this).parent().data('id')
      query.modal.answer.data('id-person', id)
      query.modal.answer.modal('show')
    })
  }

  function listenerButtonModalInput() {
    $('#btnResponde').on('click', function() {
      var $button = $(this)
      var $input = $('#inputModalResposta')
      var resposta = $input.val()
      var id = query.modal.answer.data('id-person')

      if(resposta !== null && resposta !== '') {
        verifyAnswer(id, resposta)
        $('.card-wars li').each(function(i){
          $(this).find('[data-id='+id+'] .btn-input').prop('disabled', true)
        })
        $input.val('')
      }
      query.modal.answer.modal('hide')
    })
  }

  function verifyAnswer(id, resposta) {
    getDetailsInformation(id).then(function(response){
      var isCorrect = false

      if(response.data.name === resposta) {
        isCorrect = true
      }

      if(query.user !== undefined && existsPerson(id)) {
        query.user.forEach(function(el) {
          if(el.person === id) {
            el.val = resposta
            el.correct = isCorrect
          }
        })
      } else {
        query.user.push({person:id, val: resposta, details: false, correct: isCorrect})
      }
    })
  }

  function existsPerson(id) {
    var existe = false
    query.user.forEach(function(el) {
      if(el.id === id) {
        existe = true
      }
    })
    return existe
  }

  function getDetailsInformation (id) {
    return axios.get('https://swapi.co/api/people/' + id)
  }

  function createTemplateDynamic () {
    var $ul = $('ul.card-wars');

    query.images.forEach(function(image){
      $ul.append($('<li />', {'class': query.template.cssLi})
      .append($('<img />', {'class': query.template.img.css, 'src': image.img,'alt': 'Person Star Wars' }))
      .append($('<div />',  {'data-id': image.id})
      .append($('<button />', {'type' : 'button', 'class': 'margin-right-2x button button--small button--silver btn-input', 'title': 'Responder'}).text('?'))
      .append($('<button />', {'type' : 'button', 'class': 'button button--small button--silver btn-details', 'title': 'Detalhes'}).text('...'))));
    })
  }

  function listenerButtonDetails() {
    $('.btn-details').on('click', function() {
      var id =  $(this).parent().data('id')
      var src = $(this).parent().parent().find('img').attr('src')
      var information = {}

      getDetailsInformation(id).then(function(response){
        information = {
            specie: '',
            height : response.data.height,
            image : src,
            hair: response.data.hair_color,
            planet: '',
            movies: '',
            vehicles: ''
        }

        requestInformation(response.data, information).then(function(){
          fillModal(information)

          if(query.user !== undefined && existsPerson(id)) {
            query.user.forEach(function(el) {
              if(el.id === id) {
                  el.details = true
              }
            })
          } else {
            query.user.push({person: id, val: '', details: true, correct: false})
          }
          query.modal.details.modal('show')
        })
      })
    })
  }

  function mountsUrl(arrayUrls) {
    return axios.all(arrayUrls.map(l => axios.get(l)))
  }

  async function requestInformation(data, information) {
      axios.get(data.homeworld).then(function(response){
        information.planet = response.data.name
      })

     await mountsUrl(data.species).then(axios.spread(function (...res) {
       var species = []

      res.forEach(function(res){
         species.push(res.data.name)
       })

       information.specie = species.join(', ')
    }))

    await mountsUrl(data.films).then(axios.spread(function (...res) {
      var movies = []

      res.forEach(function(res){
        movies.push(res.data.title)
      })

      information.movies = movies.join(', ')
    }))

    await mountsUrl(data.vehicles).then(axios.spread(function (...res) {
      var vehicles = []

      res.forEach(function(res){
        vehicles.push(res.data.name)
      })

      information.vehicles = vehicles.join(', ')
    }))
  }

  function getSpecie(url) {
    return axios.get(url)
  }

  function fillModal (data) {
    query.personDetails.specie.text(data.specie)
    query.personDetails.height.text(data.height)
    query.personDetails.hair.text(data.hair)
    query.personDetails.imgPersonModal.attr('src', data.image)
    query.personDetails.planet.text(data.planet)
    query.personDetails.movies.text(data.movies)
    query.personDetails.vehicles.text(data.vehicles)
  }

  function finish() {
    var points = 0

    query.modal.answer.modal('hide')
    query.modal.details.modal('hide')

    if(query.user !== undefined) {
      query.user.forEach(function (el){
        if(el.correct) {
          if (el.details === true) {
            points = points + 5
          } else {
            points = points + 10
          }
        }
      })
    }

    $('#pontuacao').text(String(points))
    query.point = points
    query.modal.finish.modal({backdrop: 'static', keyboard: false})
    query.modal.finish.modal('show')
  }

  function listenerButtonModalFinish() {
    $('#btnSaveResult').on('click', function(){
      var name = $('#nameUser').val()
      var email = $('#emailUser').val()
      $('#message').hide();

      if(name !== null && name !== '') {
        addLocalStorage(name, email)
        window.location.href = '/'
      } else {
        $('#nameUser').focus()
        $('#message').show();
      }
    })
  }

  function addLocalStorage(userName, userEmail){
    var users = localStorage.getItem(query.keyStorage)
    users = JSON.parse(users)

    if(users == null) {
      users = []
    }

    var user = JSON.stringify({
        name: userName,
        email: userEmail,
        point: query.point
    });

    users.push(user)
    localStorage.setItem(query.keyStorage, JSON.stringify(users))
  }

  init()

})(window.$)
