import jQuery from 'jquery'
import * as Parallax from 'parallax-js'
import * as WOW from 'wow.js'

import LIBS from "./libs/lib.js"

(function ($) {
	function initParallaxEnllax() {
		$(window).on('load', function () {
			$(window).enllax();
			$('.enllax').enllax();
		})
	}

	$(".star > span").click(function() {
	    $([document.documentElement, document.body]).animate({
	        scrollTop: $(".elephant").offset().top
	    }, 1000);
	});

	function initWebinar (dd,hh,mm) {
		// Set the date we're counting down to
		var countDownDate = new Date(dd).getTime();
		var lengthHours = hh,	
			mins = mm;

		// Update the count down every 1 second
		var Webinar = setInterval(function() {

		  // Get todays date and time
		  var now = new Date().getTime();

		  // Find the distance between now and the count down date
		  var distance = countDownDate - now;

		  // Time calculations for days, hours, minutes and seconds
		  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	  	  (seconds < 10) ? seconds = '0'+seconds : seconds;
	 	  (minutes < 10) ? minutes = '0'+minutes : minutes;
	  	  (hours < 10) ? hours = '0'+hours : hours;
	  	  (days < 10) ? days = '0'+days : days
		  if(days == 0 && hours == 0) {
		  	$('.timer').html(`${minutes}:${seconds}`)
		  } else if(days == 0 && hours != 0) {
		  	$('.timer').html(`${hours}:${minutes}:${seconds}`)
		  } else {
		  	$('.timer').html(`${days}:${hours}:${minutes}:${seconds}`)
		  }
		  // If the count down is finished, write some text 
		  if (distance < 0) {
		  	let n = new Date().getTime()
		  	let dist = n - countDownDate
		  	let h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		  	let m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
		  	let msg = '';
		  	if(h >= lengthHours && m >= mins) {
		  		msg = 'ПРОШЕЛ';
		  		clearInterval(Webinar)
		  	} else {
		  		msg = 'В ЭФИРЕ';
		  	}

		  	$('.timer').html(msg)
		  }
		}, 1000);
	}

	const WebinarObj = {
		data: null,
		getData () {
			$.ajax({
				url: API_URL + 'api.php',
				method: "GET" 
			}).done(data => {
				this.data = data
				this.initData()
			})
		},
		initData() {
			const date = this.data.date.split(' ')
			const reverseDate = date[0].split('.').reverse()
			const stringDate = reverseDate.join('.') + ' ' + date[1]

			initWebinar(stringDate,parseInt(this.data.hours),parseInt(this.data.minutes))
			$('.webinar__mac-image').attr('style',`background: url("${this.data.img}")`);
			$('.webinar__zapis a').attr('href',this.data.link)
			$('.webinar__descr-name').html(`"${this.data.name}"`).attr('data-placeholder',`"${this.data.name}"`)
		}
	}
	WebinarObj.getData()

	const Elephant = {
		clickColor: '#EAA000',
		hoverColor: '#ffc13b',
		defaultColor: '#FAAC02',
		figures: $('.all_figures'),
		hover () {
			this.figures.mouseover(e => {
				if(!e.relatedTarget.id.indexOf('fig') || e.target.getAttribute('data-figure')) {
					$('#top_style').html('')
				} 
			})
			$('g[class^="gf"], text').hover(e => {
				let f = e.target.id
				let newFig = f.replace(/fig/,'')
				let box = `#box${newFig}`
				let elem = $(box)
				elem.html(`<img src="${elem.attr('data-img')}" />`)
				$('#top_style').html(`*[data-figure="#${f}"] {filter: url(#shadow)} ${box} {display:flex;justify-content:center;align-items:center;`)
			})
			this.figures.mouseleave(e => {
				if(e.relatedTarget.id === '') {
					e.target.style = ''
					$('#top_style').html('')
					this.fillFigure(e.target,this.defaultColor)
				}
			})
		},
		fillFigure (fig,color) {
			return fig.setAttribute('fill',color)
		},
		init () {
			this.hover()

			$('#elephant g[class^="gf"]').each(function () {
				$(this).find('text').attr('data-modal',$(this).attr('data-modal')).attr('data-opts',$(this).attr('data-opts'))
			})
		}
	}

	const DigitalModal = {
		prefix: 'data-modal',
		timeClose: 400,
		modals: [],

		currentVideo: null,
		currentVideoPlay: null,

		isModalOpen (modal) {
			return modal.hasClass('modal_show')
		},
		startVideo (modal,video) {
			this.currentVideo = video.split('=')[1]
			this.currentVideoPlay = '?autoplay=1'
			let videoUrl = 'https://www.youtube.com/embed/' + this.currentVideo + this.currentVideoPlay

			modal.find('.modals').html(`<span class="close">X</span><iframe width="90%" height="90%" src="${videoUrl}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
		},
		stopVideo (modal) {
			modal.find('iframe').remove()
		},
		modalOpen (modal,opts) {
			$('html,body').css({'overflow':'hidden'})

			if(modal.video) this.startVideo(modal,modal.video)

			if( opts ) {
				let obj = this.strToObject(opts)

				modal.find('h3').html(obj.name)
				modal.find('.modals-descr > p').html(obj.descr)
				modal.find('img').attr('src','img/boxes/'+obj.img)
				modal.find('#webinar_course_name').val(obj.name)

				if(obj.list) modal.find('ul').html(obj.list) 
			}

			this.open(modal)
			this.modals.push(modal)
			this.modalOptions(modal)
		},
		strToObject(str) {
			let arrayOpts = str.split(',')
			let obj = {}
			let mapOpts = arrayOpts.map(item => {
				return item.split('=>')
			}).forEach(item => {
				Object.assign(obj,{[item[0]]:item[1]})
			})

			if(obj.list) {
				obj.list = obj.list.split(';').map(listText => {
					return `<li>${listText}</li>`
				})
			}

			return obj
		},
		open (modal) {
			if(modal.hasClass('webinar_wrapper') && window.innerWidth <= 600) {
				modal.attr('style','display:block;')
			} else {
				modal.attr('style','display:flex;justify-content:center;align-items:center;!important')
			}
			setTimeout(() => { modal.addClass('modal_show') }, this.timeClose)
		},
		modalOptions (modal) {
			let last = this.modals[this.modals.length-1]
			let closeClick = last[0].querySelector('.close')
			closeClick.onclick =  () => {
				this.modalClose(last)
				closeClick.onclick = null
				return 
			}
			last[0].onclick = e => {
				try {
					if(e.target.className.indexOf('modal_wrapper') > -1) {
						this.modalClose(last)
						last[0].onclick = null
					}
				} catch (e) {}
				return 
			}
			document.body.onkeyup = e => {
				if(e.keyCode == 27) {
					let lastModal = this.modals[this.modals.length-1]
					this.modalClose(lastModal, modals => {
						if(modals.length <= 0) document.body.onkeyup = null
					})
				}
			}
			return 
		},
		modalClose (last,callback) {
			if( this.currentVideo ) {
				this.currentVideoPlay = '?autoplay=0'
				this.stopVideo(last)
			}

			return new Promise(resolve => {
				last.removeClass('modal_show')
				setTimeout(() => { 
					last.attr('style','')
					resolve()
				}, this.timeClose)
			}).then(() => {
				if($('.modal_show').length <= 0) {$('html,body').attr('style','')}
				this.modals.pop()
				if(callback) callback(this.modals)
			})
		},
		allClose() {
			this.modals.forEach((n,i) => {
				n.removeClass('modal_show')
				setTimeout(() => { 
					n.attr('style','')
				}, this.timeClose)
				this.modals.splice(i,1)
			})
		},
		init () {
			$(`*[${this.prefix}]`).click(e => {
				e.cancelBubble = true
				e.preventDefault()
				let getModal = e.currentTarget.getAttribute(this.prefix)
				let currentModal = $(getModal)
				let opts = e.currentTarget.getAttribute('data-opts')

				currentModal.video = e.currentTarget.getAttribute('data-video')

				if(!this.isModalOpen(currentModal)) {
					(opts) ? this.modalOpen(currentModal,opts) : this.modalOpen(currentModal)
				} else {
					this.modalClose(currentModal)
				}
				return
			})
		},
		clearInputs (form) {
			form.find('input:not([type="submit"])').attr('value','').val('')
		} 
	}

	function initCards () {
		if(window.innerWidth <= 991) {
			if(!$('.cards').hasClass('.cards_visible')) {
				$('.cards').addClass('cards_visible')

				const cards = new Array(
					{name: 'Выбор концепции', descr: 'Специалист по<br/>контекстной рекламе', img: 'box2.png'},
					{name: 'Набор услуг', descr: 'Специалист по<br/>контекстной рекламе', img: 'nabor_uslug.png'},
					{name: 'Начальная упаковка', descr: 'Специалист по<br/>контекстной рекламе', img: 'box1.png'},
					{name: 'Юридические вопросы', descr: 'Специалист по<br/>контекстной рекламе', img: 'answers.png'},
					{name: 'Сотрудники и HR', descr: 'Специалист по<br/>контекстной рекламе', img: 'hr.png'},
					{name: 'Офис и удаленка', descr: 'Специалист по<br/>контекстной рекламе', img: 'ofis.png'},
					{name: 'Ведение клиентов', descr: 'Специалист по<br/>контекстной рекламе', img: 'vedenie.png'},
					{name: 'Продажи и продвижение', descr: 'Специалист по<br/>контекстной рекламе', img: 'provd.png'},
					{name: 'Документы', descr: 'Специалист по<br/>контекстной рекламе', img: 'documents.png'},
					{name: 'Тендеры', descr: 'Специалист по<br/>контекстной рекламе', img: 'tender.png'},
					{name: 'Планирование на 3 года', descr: 'Специалист по<br/>контекстной рекламе', img: 'plan.png'},
					{name: 'Франшиза', descr: 'Специалист по<br/>контекстной рекламе', img: 'fransh.png'},
				).map((item,i) => {
					return `<div class="col-sm-6 col-lg-6 col-md-4 col-xs-6">
								<div class="cards__item" id="cards__item${i+1}">
									<span class="cards__item-counter">${i+1}</span>
									<img src="img/boxes/${item.img}" class="cards__item-img" alt="" />
									<strong class="cards__item-head">${item.name}</strong>
									<p class="cards__item-descr">${item.descr}</p>
									<button type="button" class="cards__item-click" data-opts="name=>${item.name},img=>${item.img}" data-modal="#webinar_modal">Содержание блока</button>
								</div>
							</div>`
				}).join('')
				$('.cards > .row').html(cards)
				DigitalModal.init()
			}
		}
	}

	function submittingForms () {
		// digital_form_submit (not modal)
		$('.modal_wrapper form').submit(function (e) {
			e.preventDefault()
			let $ser = $(this).serialize()
			$.ajax({
				method: $(this).attr('method'),
				url: API_URL + 'sendler.php',
				data: $ser
			}).done(data => {
				console.log(data)

				DigitalModal.allClose()
				DigitalModal.clearInputs($(this))
				DigitalModal.modalOpen($($(this).attr('data-success')))
			})
		})	
		$('section form').submit(function (e) {
			e.preventDefault()
			DigitalModal.modalOpen($($(this).attr('data-success')))
			let $ser = $(this).serialize()
			$.ajax({
				method: $(this).attr('method'),
				url: API_URL + 'sendler.php',
				data: $ser
			}).done(data => {
				console.log(data)

				$(this).find('input:not([type="submit"])').val('')
			})
		})
	}

	function Scroller () {
		const el = $('.bottom_scrolling_checker');
		$(window).scroll(function () {
			let wH = window.innerHeight,
				sY = window.scrollY,
				offsetTopEl = (wH+sY-1 > 10000) ? 10000 : wH+sY-1;
			el.css({'top':`${offsetTopEl}px`})

			checkBlockPoisition(offsetTopEl)
		})

		function checkBlockPoisition(Y) {
			let eleph = $('.elephant')
			let price = $('.prices')
			if(eleph.offset().top <= Y && eleph.offset().top + eleph.height()*1.5 >= Y) {
				elephantBgAnimation(Y,eleph.offset().top)
			} 
			if(price.offset().top <= Y && price.offset().top + price.height()*1.5 >= Y) {
				priceBgAnimation(Y,price.offset().top)
			} else {
				$('.prices__bg .line').removeAttr('style')	
			}
		}

		function elephantBgAnimation (Y1,Y2) {
			let responsive = (Y1-Y2) / 40
			let elems = $('.elephant__background-placeholder__item').each((i,e) => {
				if(i !== 0) {
					e.style = `margin-left:${responsive*i}px;margin-top: -${responsive*i}px`
				}
			})
		}

		function priceBgAnimation (Y1,Y2) {
			let responsive = (Y1-Y2) / 50
			let elems = $('.prices__bg .line').each((i,e) => {
				e.style = `margin-top: ${responsive*i}px`
			})
		}
	}

	function initPlugins () {
		// ModalPlugin initialization
		DigitalModal.init()
		// wow animation
		new WOW().init()
		// checking scroller (DOM is .bottom_scrolling_checker)
		if(location.href.indexOf('webinar.html') > -1) {}
		else Scroller()
		// submit forms
		submittingForms()
		// other libs load
		LIBS(jQuery)
		// parallax && enllaxx
		initParallaxEnllax()
		// scenes
		let scenes = document.querySelectorAll('.scene__placeholder').forEach(scene => {
			new Parallax(scene)
		})
		// elephant engine
		Elephant.init()
		// initCards on tablet and mobile devices
		initCards()
	}

	initPlugins()
})(jQuery)