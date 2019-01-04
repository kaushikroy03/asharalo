$(function(){

$(document).ready(function(){

	$('#ham').click(function(e){
		e.stopPropagation();
		$('.hamburger').toggleClass('is-active');
		$('#menu').toggleClass('menu-is-active');


		$(document).click(function(){
			$('.hamburger').removeClass('is-active');
			$('#menu').removeClass('menu-is-active');
			$(this).unbind('click');
		});
	});


	$('.gallery img').click(function(e){
		e.preventDefault();

		$('.gallery img').removeClass('opened');

		$(this).addClass('opened');

		var imgSrc = $(this).attr('src');

		var originalName = getName(imgSrc);

		$('.popupContainer').remove();


		$('body').append('<div class="popupContainer x"><div class="popHtmlContainer x"><div class="popItemContainer x"><img class="workImg" src="assets/images/work/'+originalName+'"></div><div class="popItemContainer arrowContainer leftArrow"><img src="assets/images/arrow.png"></div><div class="popItemContainer arrowContainer rightArrow"><img src="assets/images/arrow.png"></div><div class="close"><img src="assets/images/close.png" class="x"></div></div>');

		$('.popupContainer').fadeIn();


		$(document).on('click', '.arrowContainer', function(e){
			changeImage(e);
		});

		$(document).on('keyup', function(e){
			changeImage(e);
		});

		closePopup();

	});


	function closePopup(){
		$(document).on('click', function(e){
			if ($(e.target).hasClass('x') == true) {
				$('.gallery img').removeClass('opened');
				$('.popupContainer').fadeOut();
				setTimeout(function(){
					$('.popupContainer').remove();
				},1000);
				$(document).unbind('click');
				$(document).unbind('keyup');
			}
		});
	}

	function getName(thumbAddress){
		var imgName = thumbAddress.split('/')[3];

		var noExtName = imgName.split('.');
		var ext = noExtName.pop();

		var name = noExtName.join('').split('-');
		name.pop();

		var originalName = name.join('')+'.'+ext;

		return originalName;
	}

	function changeImage(e){

		e.preventDefault();

		var opened = $('.opened'),
			images = $('.gallery img'),
			index = images.index(opened);

		images.removeClass('opened');

		if (($(e.target).hasClass('rightArrow') == true || $(e.target).parent().hasClass('rightArrow') == true) || (e.keyCode == 39)) {

			if (index + 1 == images.length) {
				images.eq(0).addClass('opened');
			}else{
				images.eq(index + 1).addClass('opened');
			}
		}

		if (($(e.target).hasClass('leftArrow') == true || $(e.target).parent().hasClass('leftArrow') == true) || (e.keyCode == 37)) {
			images.eq(index - 1).addClass('opened');
		}

		var newImgSrc = $('.opened').attr('src'),
			newImageOriginalName = getName(newImgSrc);

		$('.workImg').attr('src', 'assets/images/work/'+newImageOriginalName);
	}



	//Whatsapp Open
	$(document).on('click', '#whatsapp', function(e) {
		e.preventDefault();

		var text = 'Hi! I want to talk about a project.';
		var url = 'https://api.whatsapp.com/send?phone=919647552333&text='+encodeURIComponent(text);

		window.location.href = url;
	});


	function showError(input, message){
		var parent = input.parent();

		input.css('border-bottom', '2px solid #ff6798');
		parent.append('<div class="error">'+message+'</div>');

		$('.error').fadeIn();
		//$('.error').css('height', '24px', 'margin-top', '10px');

		$('.error').animate({
			'height' : '24px',
			'opacity' : '1',
			'margin-top': '10px'
		});
	};

	$('.ajaxForm input[type="text"], textarea').focusout(function(){
		if ($.trim($(this).val()) != '') {

			if ($(this).attr('type') == 'text') {
				$(this).css('border-bottom', '2px solid #2edec6');
			}

			var name = $(this).attr('name'),
				value = $.trim($(this).val());

			if (name == 'number' && value != '') {
				$(this).next('.error').remove();
				var reg = new RegExp('^\\d+$');
				if (reg.test(value) == false) {
					showError($(this), 'Invalid number');
				}
			}
		}else{
			$(this).css('border-bottom', '2px solid #aeb0bf');

			if ($(this).attr('type') == 'text') {
				$(this).css('border-bottom', '2px solid #b8b8ce');
			}

			if ($(this).attr('name') == 'message') {
				$(this).css('border', '2px solid #b8b8ce');
			}
		}
	});

	$('.ajaxForm input[type="text"], textarea').focus(function(){

		if ($(this).attr('type') == 'text') {
			$(this).css('border-bottom', '2px solid #6f7284');
		}

		if ($(this).attr('name') == 'message') {
			$(this).css('border', '2px solid #6f7284');
		}

		var e = $(this).next('.error');
		e.animate({
			'height' : '0',
			'opacity' : '0',
			'margin-top': '0'
		}, 200);
		setTimeout(function(){
			e.remove();
        }, 200);
	});


	$(".ajaxForm").submit(function(e){
        e.preventDefault();
        var href = $(this).attr("action");

        var error = false;

        $('.error').remove();
        $('.popBox').remove();

        $(this).find('[name]').each(function(){
        	var input = $(this),
				name = input.attr('name'),
				value = $.trim(input.val());

			input.css('border-bottom', '2px solid #6f7284');

			if (name != '_gotcha') {
				if (value == '') {
					input.val('');
					showError(input, 'Left empty');
					error = true;
				}
			}

			var reg = new RegExp('^\\d+$');

			if (name == 'number' && value != '') {
				if (reg.test(value) == false) {
					showError(input, 'Invalid number');
					error = true;
				}
			}

        });

        if (error != true) {

        	$.ajax({
	            type: "POST",
	            url: href,
	            data: new FormData(this),
	            dataType: "json",
	            processData: false,
	            contentType: false,
	            success: function(response){
	                if(response.status == "success"){
	                	$(this).trigger('reset');
	                    $('body').append('<div class="ajaxPopup bounceInDown animated text-cen"><div class="pink">THANK YOU</div><div class="navy">We\'ll contact you regarding this.</div></div>');
	                }else{
	                    $('body').append('<div class="ajaxPopup bounceInDown animated text-cen"><div class="red">An error occured. Please try again later.</div></div>');
	                }

	                setTimeout(function(){
			        	$('.ajaxPopup').fadeOut(200);
			        }, 5000);
	            },
	            error: function(error){
	            	$('body').append('<div class="ajaxPopup bounceInDown animated text-cen"><div class="red">An error occured. Please try again later.</div></div>');
	            	setTimeout(function(){
			        	$('.ajaxPopup').fadeOut(200);
			        }, 3000);
	            }
	        });
        }

    });


    $('#language li').click(function(){

    	var url = $(location).attr('href'),
    		urlParams = url.split('/'),
    		page = urlParams[urlParams.length - 1];

    	var language = $(this).data('name');

    	if (language == 'en') {
    		window.location = 'http://localhost/aa/'+page;
    	}else{
	    	window.location = 'http://localhost/aa/'+language+'/'+page;
    	}
    });


});

});