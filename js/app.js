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
  const pagePos = function() {
                  const pageY = $(window).scrollTop();
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
  const link = $(this).attr('href');
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
let lastId
let topMenu = $(".menu-list")
let topMenuHeight = topMenu.outerHeight()
// All list items
let menuItems = topMenu.find("a")
// Anchors corresponding to menu items
const scrollItems = menuItems.map(function() {
  let item = $($(this).attr("href"));
  if (item.length) { return item; }
});

// Bind click handler to menu items for fancy scroll animation
menuItems.on('click touchend', function() {
  const href = $(this).attr("href");
  const offsetTop = href === "#" ? 0 : $(href).offset().top;/*--- Uncomment for fancy scrolling //-topMenuHeight+1; ---*/
  if ( !isMobileWidth() ) {
    $('html, body').stop().animate({
        scrollTop: offsetTop
    }, 300);
    return false;
  }
});

// Bind to scroll
$(window).on('resize scroll', function() {

  // Get id of current scroll item
  let cur = scrollItems.map(function(item) {
    const viewportTop = $(window).scrollTop() + topMenuHeight;
    if ($(this).offset().top < viewportTop) return this;
  });
  // Get the id of the current element
  cur = cur[cur.length - 1];
  const id = cur && cur.length ? cur[0].id : "";

  if (lastId !== id) {
    lastId = id;
    // Set/remove active class
    menuItems
      .parent().removeClass("menu-selected")
      .end()
      .filter(`[href='#${id}']`)
      .parent()
      .addClass("menu-selected");
  }
});