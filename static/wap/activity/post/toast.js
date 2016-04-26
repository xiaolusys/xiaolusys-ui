window.Toast = (function() {
  return {
    DEFAULT_CLASS: 'toast-item',

    /*
     * Duration variables in milis
     */
    DURATION_LONG: 4000,
    DURATION_NORMAL: 2000,
    DURATION_SHORT: 1000,

    /*
     * Position variables
     */
    POSITION_TOP: 'top',
    POSITION_BOTTOM: 'bottom',
    POSITION_MIDDLE: 'middle',

    /*
     * Align variables
     */
    ALIGN_CENTER: 'center',
    ALIGN_LEFT: 'left',
    ALIGN_RIGHT: 'right',

    /*
     * Queue variable for queuing toast messages
     */
    QUEUE: new Array(),
    TIMEOUT: null,
    TIMEOUT_HIDE: null,

    /*
     * Shows toast message or queues it to show
     */
    show: function(params) {
      var CONFIG = {
        position: Toast.POSITION_BOTTOM,
        duration: Toast.DURATION_NORMAL,
        align: Toast.ALIGN_CENTER,
        class: Toast.DEFAULT_CLASS,
        background: '#000000',
        color: '#ffffff',
        opacity: '0.6',
        radius: '16',
        fontSize: '14px',
        appearTime: 0.3, // seconds
        message: '',
        top: '40px', // if position-top top:40px, position-bottom bottom:40px
        left: '40px', // if align-left left:40px, align-right left:40px
      };

      if (typeof(params) === 'string') {
        CONFIG.message = params;
      } else if (params) {
        $.extend(CONFIG, params);
      }

      var isAlreadyInQueue = false;
      $(Toast.QUEUE).each(function(i, toast) {
        if (toast.message !== CONFIG.message) {
          return;
        }

        isAlreadyInQueue = true;
        return;
      });

      if (isAlreadyInQueue) {
        return;
      }

      Toast.QUEUE.push(CONFIG);

      // if queue is not empty push it to queue to show later
      if (Toast.QUEUE.length > 1) {
        return;
      }

      Toast.processQueue(Toast.QUEUE[0]);
    },

    /*
     * Process' toast queue in order
     */
    processQueue: function(toast) {
      var $toast = $('.' + Toast.DEFAULT_CLASS);

      if ($toast.length > 0) {
        $toast.remove();
      }

      var cssClass = Toast.DEFAULT_CLASS + (toast.class !== '' ? ' ' + toast.class : '');
      var style = 'position:absolute; display:block; text-align:center; height: auto; overflow: hidden; padding:10px 18px 10px 18px; opacity:0; z-index:100000;';
      style += 'border-radius: ' + toast.radius + 'px; -webkit-border-radius: ' + toast.radius + 'px; -ms-border-radius:';
      style += toast.radius + 'px; -o-border-radius:' + toast.radius + 'px; -moz-border-radius: ' + toast.radius + 'px;';
      style += '-webkit-transition: opacity ' + toast.appearTime + 's; -o-transition: opacity ' + toast.appearTime + 's; transition: opacity';
      style += toast.appearTime + 's; -moz-transition: opacity ' + toast.appearTime + 's; -ms-transition: opacity ' + toast.appearTime + 's;';
      style += 'background: ' + toast.background + '; color: ' + toast.color + '; font-size:' + toast.fontSize + ';';

      $('body').append('<div style="' + style + '" class="' + cssClass + '">' + toast.message + '</div>');

      setTimeout(function() {
        $toast = $('.' + toast.class);

        switch (toast.position) {
          case Toast.POSITION_TOP:
            $toast.css('top', toast.top);
            break;
          case Toast.POSITION_MIDDLE:
            $toast.css('top', ($(window).height() - $toast.outerHeight(true)) / 2);
            break;
          default:
            $toast.css('bottom', toast.top);
            break;
        }

        switch (toast.align) {
          case Toast.ALIGN_LEFT:
            $toast.css('left', toast.left);
            break;
          case Toast.ALIGN_RIGHT:
            $toast.css('right', toast.left);
            break;
          default:
            $toast.css('left', ($(window).width() - $toast.outerWidth(true)) / 2);
            break;
        }

        $toast.css('opacity', toast.opacity);
      }, 50);

      // Toast engine
      Toast.TIMEOUT = setTimeout(function() {
        $toast = $('.' + Toast.DEFAULT_CLASS);

        if (Toast.QUEUE.length <= 0) {
          $toast.remove();
          return;
        }

        // Remove from queue
        Toast.QUEUE.splice(0, 1);

        $toast.css('opacity', 0);

        Toast.TIMEOUT_HIDE = setTimeout(function() {
          $toast = $('.' + Toast.DEFAULT_CLASS);
          $toast.remove();

          if (Toast.QUEUE.length <= 0) {
            clearTimeout(Toast.TIMEOUT_HIDE);
            return;
          }

          // Continue processing
          Toast.processQueue(Toast.QUEUE[0]);
        }, (toast.appearTime * 1000));
      }, toast.duration);
    },

    /*
     * Stops showing toast messages and clears queue
     */
    clear: function() {
      var $toast = $('.' + Toast.DEFAULT_CLASS);
      $toast.remove();
      Toast.QUEUE = new Array();

      if (Toast.TIMEOUT !== null) {
        clearTimeout(Toast.TIMEOUT);
      }

      if (Toast.TIMEOUT_HIDE !== null) {
        clearTimeout(Toast.TIMEOUT_HIDE);
      }
    },
  };
})();
