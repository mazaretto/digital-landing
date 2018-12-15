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

	const DigitalModal = {
		prefix: 'data-modal',
		timeClose: 400,
		modals: [],
		isModalOpen (modal) {
			return modal.hasClass('modal_show')
		},
		modalOpen (modal) {
			$('html,body').css({'overflow':'hidden'})
			modal.attr('style','display:flex;justify-content:center;align-items:center;!important')
			setTimeout(() => { modal.addClass('modal_show') }, this.timeClose)
			this.modals.push(modal)
			this.modalOptions(modal)
		},
		modalOptions (modal) {
			let last = this.modals[this.modals.length-1]

			last.find('.close').click(e => {
				this.modalClose(last)
				return 
			})
			last.click(e => {
				try {
					if(e.target.className.indexOf('modal_wrapper') > -1) {
						this.modalClose(last)
					}
				} catch (e) {}
				return 
			})
			document.body.onkeyup = e => {
				if(e.keyCode == 27) {
					let lastModal = this.modals[this.modals.length-1]
					this.modalClose(lastModal, modals => {
						console.log(modals.length)
						if(modals.length <= 0) document.body.onkeyup = null
					})
				}
			}
			return 
		},
		modalClose (last,callback) {
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
		init () {
			$(`*[${this.prefix}]`).click(e => {
				e.preventDefault()
				let getModal = e.target.getAttribute(this.prefix)
				let currentModal = $(getModal)
				if(!this.isModalOpen(currentModal)) {
					this.modalOpen(currentModal)
				} else {
					this.modalClose(currentModal)
				}

				return
			})
		}
	}

	function submittingForms () {
		// digital_form_submit (not modal)
		$('.digital_form-this').submit(function (e) {
			e.preventDefault()
			DigitalModal.modalOpen($('#success_modal'))
		})	
	}

	function Scroller () {
		const el = $('.bottom_scrolling_checker');
		$(window).scroll(function () {
			let wH = window.innerHeight,
				sY = window.scrollY,
				offsetTopEl = wH+sY-1;
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
		DigitalModal.init()
		new WOW().init()
		Scroller()
		submittingForms()
		LIBS(jQuery)
		initParallaxEnllax()
		// scenes
		let scenes = document.querySelectorAll('.scene__placeholder').forEach(scene => {
			new Parallax(scene)
		})
	}

	initPlugins()
})(jQuery)