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