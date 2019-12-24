  
  function closeNav() {
      $("html").removeClass("nav-open");
      var id;
      id = setTimeout(function() {
          clearTimeout(id);
          $(".new-nav").addClass("delay-hidden");
      }, 333);
  }
  var previousY = 0;

  $(window).scroll(function() {
      //$input.text($(window).scrollTop() + " dh "+$(document).height());

      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      if (previousY > scrollTop) { //scrolling up, show header
          if ($(".thumb-menu-wrapper").hasClass("open"))
              $(".thumb-menu-wrapper").removeClass("open");

          if (!$(".gheader").hasClass("open"))
              $(".gheader").addClass("open");

      } else if (scrollTop > 60 && previousY < scrollTop && $(".gheader")) { //scroll down

          if ($(".gheader").hasClass("open"))
              $(".gheader").removeClass("open");
          if ($("html").hasClass("nav-open"))
              closeNav();

      }

      previousY = scrollTop;
  });

  $(".nav-toggle").click(function() {
      $("html").addClass("nav-open");
      $(".new-nav").removeClass("delay-hidden");
  })

  $(".close-nav-button").click(function() {
      closeNav();
  })