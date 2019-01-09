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

	$('.scrollto').click(function (e) {
		e.preventDefault();

		let hr = $($(this).attr('href'))
		let offTop = hr.offset().top

		$('html, body:not(:animated)').animate({
			scrollTop: offTop
		}, 1000)
	})

	var moscowTime = (callback) => {
		$.ajax({
			method: 'GET',
			url: 'http://api.geonames.org/timezoneJSON?lat=55.753215&lng=37.622504&username=mazaretto'
		}).done(data => {
			return callback(data)
		})
	}

	function initWebinar (dd,hh,mm) {
		let mTime = moscowTime(moscowTime => {
			 // Set the date we're counting down to
			var countDownDate = new Date(dd);
			var lengthHours = hh,	
				mins = mm;

			var moscowDate = new Date(moscowTime.time)
			var nn = new Date();
			var hoursMoscow = nn.getHours()-moscowDate.getHours()

			countDownDate = new Date(countDownDate.setHours(countDownDate.getHours()+hoursMoscow))
			// Update the count down every 1 second
			var Webinar = setInterval(function() {
			  // Get todays date and time
			  var now = new Date();
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
		})
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
			let arrayOpts = str.split('&')
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
				modal.attr('style','display:flex;justify-content:center;align-items:center;')
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
					{name: 'Выбор концепции', list: 'Конвеер + аавтоматизация;Индивидуальный подход;Узкое нишевание;Премиум сегмент;Production агентство', descr: 'Выбор концепции развития агентства - самый важный шаг на начале пути. Именно по причине пропуска этого пункта, часто вы видите агентства, которые занимаются всем подряд, но денег у них нет. По прохождению этого модуля вы получите полноценную картину развития вашей компании в рамках определнной концепции.', img: 'box2.png'},
					{name: 'Набор услуг', list: 'Создание матрицы услуг;Конкурентная разведка;Ценовая политика;Содержание услуги;Упаковка услуг', descr: 'Ядро любого агентства - это его матрица услуг. То, в чем вы являетесь экспертами и за что сможете ручаться своим именем. Создавать матрицу услуг стоит вкратчиво и вдумчиво, поскольку нужно соблюсти баланс между расходами маржей компании, а так же услуги, которые вы упакуете должны пользоваться спросом.', img: 'nabor_uslug.png'},
					{name: 'Начальная упаковка', list: 'Упаковка сайтов агентства;Упаковка и ведение социальных сетей;Сторонние сайты,каталоги,рейтинги;Видео-упаковка, PR;Кейсы', descr: 'Упаковка - наверное самый важный элемент в бизнесе сегодня. Мы научим вас выделиться среди кучи дешевых предложений от фрилансеров и найти своего клиента, заявив о себе громко и ярко.', img: 'box1.png'},
					{name: 'Юридические вопросы', list: 'Открытие компании;Налоговая система;Финансовое планирование и бюджет;Юридическая безопасность;Шаблоны документов', descr: "Юридический вопрос в Digital сфере - тема сложная. Её не часто поднимают, чаще умалчивают, так как судебная практика решения вопросов в IT сфере закручена как ведьмин клубок. Тем не менее, это надо знать и вы получите исчерпывающую информацию по юридическим вопросам в Digital агентстве.", img: 'answers.png'},
					{name: 'Сотрудники и HR', list: 'Схема подбора персонала без HR;Тестирование и собеседование;Пакет документов для работы с исполнителями;Пакет документов для устройства в штат;Информационная безопасность компании', descr: 'Вопрос набора персонала особенно остро стоит в Digital мире. Т.к. большинство исполнителей самозаняты и не держатся за рабочие места, вы должны быть готовы к текучке. Как не позволить текучке подточить ваш бизнес? Этот модуль закроет все вопросы касаемо кадров в вашей компании.', img: 'hr.png'},
					{name: 'Офис и удаленка', list: 'Первый офис;Команда в офисе;Удаленная команда;Контроль сотрудников и система KPI;Отчетность и прозрачность работы', descr: 'Многие компании, зарабатывающие более 1 000 000 в месяц ведут свою деятельность без офиса. В данном модуле мы рассмотрим все варианты дислокации вас и ваших сотрудников и научим выстраивать коммуникацию с командой.', img: 'ofis.png'},
					{name: 'Ведение клиентов', list: 'Пакеты документов для всех услуг;Регламенты работы исполнителей;Правила ведения проекта и обслуживания клиента;Система лояльности и оповещений;Автоматизация процессов с помощью CRM', descr: 'Удержание клиентов - основная проблема Digital бизнеса. Зачастую из-за неумения выстраивать отношения с заказчиком, среднестатистический срок работы с клиентом студии составляет 3 месяца. Задача модуля научиться вести клиента так, чтобы он хотел работать только с вами и столько, сколько это возможно.', img: 'vedenie.png'},
					{name: 'Продажи и продвижение', list: 'Отдел продаж;Мотивация, контроль и планирование;Каналы продаж Digital агентств;Методы продвижения услуг Агентства;Дополнительные механики PR и продаж', descr: 'Все хотят много клиентов, но далеко не все понимают, как их можно заполучить. Мы отработали более 20 проверенных схем привлечения лидов и последующей их благополучной конвертации в клиентов, в данном модуле мы изучим и внедрим эти механики вместе.', img: 'provd.png'},
					{name: 'Документы', list: 'Клиентская документация;Проектная документация;Документы для ООО и ИП;Договоры с сотрудниками;Налогообложение и бухгалтерия', descr: 'Более 100 различных документов, созданных за 6 лет работы. Данный багаж знаний оценивается в более чем 900 000 рублей. Договоры постоянно совершенствуются, улучшаются, добавляются новые пункты. Пройдя этот модуль, вы будете полностью подготовлены к работе с документами, официально и прозрачно.', img: 'documents.png'},
					{name: 'Тендеры', list: 'Подготовка к участию в тендерах;Подготовка портфолио;Тендерные площадки;Заявка на тендер;Субподряды', descr: 'Самые крупные суммы Digital агентства зарабатывают на гос. закупках. Чтобы принять в них участие нужно знать несколько правил и быть готовым по ряду пунктов. Этот модуль подготовит вас к участию в тендерах.', img: 'tender.png'},
					{name: 'Планирование на 3 года', list: 'Финансовый план;Планирование развития концепции;Миссия и видение компании;Продажа бизнеса', descr: 'Любая бизнес-модель должна иметь видение её жизни на длительный срок. Грамотное планирование возможно только при условии наличия опыта в финансовой составляющей компании. К этому модулю вы подойдете уже подготовленным к тому, чтобы написать свой бизнес-план на 3 года вперед.', img: 'plan.png'},
					{name: 'Франшиза', list: 'Бесплатная упаковка;Консультирование от ТОП-менеджмента "Leadera";Передача заявок от "Leadera";Курирование франчайзи;Система обучения и база знаний', descr: 'Если вы хотите сэкономить время, деньги и нервы, вы можете приобрести уже готовую бизнес-модель от нашей компании. В данном случае вы становитесь нашим партнером и мы вместе строим ваш прибыльный бизнес по готовой системе.', img: 'fransh.png'},
				).map((item,i) => {
					return `<div class="col-sm-6 col-lg-4 col-md-6 col-xs-6">
								<div class="cards__item" id="cards__item${i+1}">
									<span class="cards__item-counter">${i+1}</span>
									<img src="img/boxes/${item.img}" class="cards__item-img" alt="" />
									<strong class="cards__item-head">${item.name}</strong>
									<button type="button" class="cards__item-click" data-opts="name=>${i+1}. ${item.name}&img=>${item.img}&descr=>${item.descr}&list=>${item.list}" data-modal="#webinar_modal">Содержание блока</button>
								</div>
							</div>`
				}).join('')
				$('.cards > .row').html(cards)
				DigitalModal.init()
				//<p class="cards__item-descr">${item.descr}</p>
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