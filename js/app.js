/*--- Easy check for mobile width ---*/
function isMobileWidth() {
  return $('.menu-mobile').is(':visible');
};

/*--------- Mobile Nav ----------*/
$(document).on('click', '.menu-icon', function(){
  $(this).hasClass('is-active') ? $(this).removeClass('is-active') : $(this).addClass('is-active')
  $('.menu').toggleClass('menu-open');
});

/*--------- Add header background on scroll ----------*/
$(function() {
  var pagePos = function() {
                  var pageY = $(window).scrollTop();
                  pageY > 1 ? $(".menu").addClass("menu-bg") : $(".menu").removeClass("menu-bg");
                  return pageY;
                };
  pagePos();
  $(window).on("scroll", function() {
      pagePos();
  });
});

/*--------- Scroll to hash ----------*/
$(document).on('click touchend', 'a[href^="#"]', function(e) {
  var link = $(this).attr('href');
  if($('.menu').hasClass('menu-open')) {
    $('.menu-icon').removeClass('is-active');
    $('.menu').toggleClass('menu-open');
  }
  if ( !isMobileWidth() ) {
    $('html,body').animate({ scrollTop: $(link).offset().top });
    return false;
  }
});

/*--------- Active Link Scroll ----------*/
var lastId,
    topMenu = $(".menu-list"),
    topMenuHeight = topMenu.outerHeight()+15,
    // All list items
    menuItems = topMenu.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

// Bind click handler to menu items for fancy scroll animation
menuItems.on('click touchend', function(){
  var href = $(this).attr("href"),
  offsetTop = href === "#" ? 0 : $(href).offset().top;/*--- Uncomment for fancy scrolling //-topMenuHeight+1; ---*/
  if ( !isMobileWidth() ) {
    $('html, body').stop().animate({
        scrollTop: offsetTop
    }, 300);
    return false;
  }
});

// Bind to scroll
$(window).scroll(function(){
 // Get container scroll position
 var fromTop = $(this).scrollTop()+topMenuHeight;

 // Get id of current scroll item
 var cur = scrollItems.map(function(){
   if ($(this).offset().top < fromTop)
     return this;
 });
 // Get the id of the current element
 cur = cur[cur.length-1];
 var id = cur && cur.length ? cur[0].id : "";

 if (lastId !== id) {
     lastId = id;
     // Set/remove active class
     menuItems
       .parent().removeClass("menu-selected")
       .end().filter("[href=#"+id+"]").parent().addClass("menu-selected");
 }
});

/*--------- Form Client-Side Validations and Ajax Submit ----------*/
$(function() {
  // Get the form.
  var form = $('form');

  // Get the messages div.
  var formMessages = $('.form-messages');

  // Set up an event listener for the contact form.
  $(form).submit(function(event) {
      // Stop the browser from submitting the form.
      event.preventDefault();

      // Store form data
      var full_name = $('#full_name').val(),
          email = $('#email').val(),
          emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
          message = $('#message').val(),
          input = $('.input-1');

      var inputErrors = function() {
        input.removeClass('error').filter(function(input){
           return !$.trim(this.value);
        }).addClass('error');
      };

      if (full_name == '' || email == '' || message == '') {
        $(formMessages).addClass('error alert-padding').text("Required fields are blank.");
        inputErrors();
        return false;
      }

      if (!emailRegex.test(email)) {
        $(input).removeClass('error');
        $(formMessages).addClass('error alert-padding').text("Please enter a valid email address.");
        $('#email').addClass('error');
        return false;
      }

      // Submit the form using AJAX.
      $.ajax({
          type: 'POST',
          url: 'mailer.php',
          data: {
            full_name: full_name,
            email: email,
            message: message
          }
      }).done(function(response) {
        input.removeClass('error');

        // Make sure that the formMessages div has the 'success' class.
        $(formMessages).removeClass('error alert-padding');
        $(formMessages).addClass('success alert-padding');

        // Set the message text.
        $(formMessages).text(response);

        // Clear the form.
        $('#full_name').val('');
        $('#email').val('');
        $('#message').val('');
    }).fail(function(data) {
      // Make sure that the formMessages div has the 'error' class.
      $(formMessages).removeClass('success alert-padding');
      $(formMessages).addClass('error alert-padding');

      // Set the message text.
      if (data.responseText !== '') {
          $(formMessages).text(data.responseText);
      } else {
          $(formMessages).text('Oops! An error occured and your message could not be sent.');
      }
   });
 });
});