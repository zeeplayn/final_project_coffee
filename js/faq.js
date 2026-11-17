$(document).ready(function () {

  $('.faq-question').on('click', function () {
    var $item = $(this).closest('.faq-item');
    var $answer = $item.find('.faq-answer');
    var $icon = $item.find('.faq-icon');

    $answer.stop(true, true);

    var willOpen = !$item.hasClass('open');
    $item.toggleClass('open', willOpen);

    $icon.text(willOpen ? '−' : '+');
    $(this).attr('aria-expanded', willOpen ? 'true' : 'false');

    $answer.slideToggle(300);
  });

});
