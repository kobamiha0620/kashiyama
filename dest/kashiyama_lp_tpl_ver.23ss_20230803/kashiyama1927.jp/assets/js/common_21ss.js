var current_scroll_pos = 0;
var window_height = window.innerHeight;
var window_width = window.innerWidth;
var isSpMode = false;
var isIeMode = false;
var isWinMode =false;
var current_gender_id = '';
var current_page_id = '';

$(function () {
  current_scroll_pos = $(window).scrollTop();
  window_height = window.innerHeight;
  window_width = window.innerWidth;
  
  judgeUserDevice();
  judgeUserAgent();
  smoothScrollOnClickAnchorLink();
  
  globalHeader.init();
  spMenu.init();
  fadeAnim.init();
  pagetop.init();
  fadeTransition.init();
  movieModal.init();
  campaignBanner.init();

  guide.init();
  staffpickSection.init();
  suitpediaSection.init();
  balloon.init();
  loggedInBtn.init();
});

$(window).on("load",function(){
  current_scroll_pos = $(window).scrollTop();
  window_height = $(window).innerHeight();
  window_width = $(window).innerWidth();
});

$(window).on('scroll', function () {
  current_scroll_pos = $(window).scrollTop();
  window_height = window.innerHeight;
  window_width = window.innerWidth;
});

$(window).on('resize', function () {
  current_scroll_pos = $(window).scrollTop();
  window_height = window.innerHeight;
  window_width = window.innerWidth;

  judgeUserDevice();
});

//PC/SP表示切り替え時に一度だけ発火するイベント
$(window).on('changeDisplayMode', function () {
  // console.log(isSpMode)
});

///////////////////////////////////////////////////////

/**
 * デバイス判定
 */
var judgeUserDevice = function(){
  var $spMenuBtn = $('.global-nav');
  var isChange = false;

  if($spMenuBtn.css('display') === 'none'){
    //PC
    if(isSpMode) isChange = true;
    isSpMode = false;
    if(isChange){
      $(window).trigger('changeDisplayMode');
    }

  }else {
    //SP
    if(!isSpMode) isChange = true;
    isSpMode = true;
    if(isChange){
      $(window).trigger('changeDisplayMode');
    }
  }
}

/**
 * ブラウザ判定
 */
var judgeUserAgent = function(){
  //IEかどうか判定
  var userAgent = window.navigator.userAgent.toLowerCase();
  if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1 || userAgent.indexOf('edge') != -1) {
    $('.page-contents').addClass('ie');
    isIeMode = true;
  }
  if (navigator.platform.indexOf("Win") != -1) {
    isWinMode = true;
    $('.page-contents').addClass('windows');
  }
}

/**
 * ヘッダー関係
 */
var globalHeader = {
  prevScrollPos: 0,
  hideTimer: '',

  init: function() {
    // globalHeader.hideNavItem();
    globalHeader.judgePageID();
    globalHeader.setActiveNavItem();
    globalHeader.setSelectBoxLabel();
    globalHeader.clickSelectBox();
    globalHeader.fixedOnScroll();
    globalHeader.showOrderBtn();
    globalHeader.replaceStaffpickLink();

    $(window).on('scroll', function () {
      globalHeader.fixedOnScroll();
      globalHeader.showOrderBtn();
    });
  },

  /**
   * スクロールでヘッダーを固定する
   */
  fixedOnScroll: function() {
    //モーダルが開いているときは処理しない（ヘッダーが不自然に隠れるため）
    if(movieModal.isOpen) return;
    
    if($('body').hasClass('unscrollable')) return;

    var $header = $('.header-common, .global-nav');
    var currentScrollPos = $(window).scrollTop();
    var delta = currentScrollPos - this.prevScrollPos;

    var header_height = $('.header-common').innerHeight();
    if($('.block-info').length > 0 && $('.page-contents').hasClass('top') && ! isSpMode){
      header_height = $('.block-info').offset().top
    }

    if (current_scroll_pos > header_height) {
      clearTimeout(this.hideTimer);

      if(delta > 0){//DOWN
        $header.addClass('is-hide').removeClass('is-no-transition');

        this.hideTimer = setTimeout(function(){
          if($header.hasClass('is-fixed')) return;
          $header.addClass('is-fixed');
        }, 500)

      }else if(delta < 0){//UP
        $header.addClass('is-fixed').removeClass('is-hide')
        if(currentScrollPos <= header_height){
          $header.addClass('is-no-transition');
        }else{
          $header.removeClass('is-no-transition');
        }
      }

    }else{
      clearTimeout(this.hideTimer);
      $header.removeClass('is-fixed is-hide');

      if(delta < 0){//UP
        if(currentScrollPos <= (header_height - $('.header-common').innerHeight())){
          $header.removeClass('is-fixed is-no-transition is-hide')
        }else{
          $header.addClass('is-fixed').removeClass('is-hide');
          if(currentScrollPos <= header_height){
            $header.addClass('is-no-transition');
          }else{
            $header.removeClass('is-no-transition');
          }
        }
      }
    }

    this.prevScrollPos = $(window).scrollTop();
  },

  /**
   * .page-contentsのclassからページIDを取得し、headerに設定
   */
  judgePageID: function(){
    if($('.page-contents').length < 1) return; //ルール破り対策

    var classes = $('.page-contents').attr('class').split(' ');
    var header_active_id = classes[1];
    var sub_header_active_id = classes[2];

    if($('.page-contents').hasClass('brands')){
      header_active_id = $('.page-contents').data('header-active-id');
      sub_header_active_id = $('.page-contents').data('sub-header-active-id');
    }

    $('.header').attr('data-active',header_active_id);
    $('.header').attr('data-sub-active',sub_header_active_id);
    $('.header-sub').attr('data-active',sub_header_active_id);
    current_gender_id = header_active_id;
    current_page_id = sub_header_active_id;
  },

  /**
   * MEN・WOMENのTOPにいるときはナビ内の「TOP」の項目を非表示にする
   */
  // hideNavItem: function() {
  //   if ($('.header-sub').hasClass('top')) {
  //     $('.header-sub .top').addClass('is-hide');
  //   }
  // },

  /**
   * アクティブなナビ項目を設定
   */
  setActiveNavItem: function() {
    var activePageID = $('.header').data('active');
    $('.header .' + activePageID).addClass('is-active');

    if($('.page-contents').hasClass('brands')){
      var activeSubPageID = $('.header').data('sub-active');
      $('.header .' + activeSubPageID).addClass('is-active');
    }

    if($('.header-sub').length < 1) return; //サブヘッダーがないときは以下は処理しない
    var activeCategoryID = $('.header-sub').data('active');
    $('.header-sub .' + activeCategoryID).addClass('is-active');

  },

  /**
   * セレクトボックスの初期値を設定(SP)
   */
  setSelectBoxLabel: function(){
    if($('.header-sub').length < 1) return;

    var activeCategoryID = $('.header-sub').data('active');
    activeCategoryID = $('.header-sub').find('.' + activeCategoryID).text();
    if(activeCategoryID === 'SETUP') activeCategoryID = 'MODERN TAILOR';

    // if(current_gender_id === 'women' && current_page_id === 'top'){
    //   activeCategoryID = 'WOMEN SUIT'
    // }

    $('.header-sub .header-select-box .label').html(activeCategoryID);
  },

  /**
   * セレクトボックスを展開(SP)
   */
  clickSelectBox: function(){
    $('.header-sub .header-select-box').on('click', function(){
      $(this).toggleClass('is-active');
      $('.header-sub .nav-list').slideToggle(300)
    });
  },

  /**
   * スクロールでサブヘッダーの「オーダーする」ボタンを表示
   */
  showOrderBtn: function(){
    if($('.header-sub').length > 0 && $('.section-mv').length > 0){
      var pos_bottom = $('.section-mv').offset().top + $('.section-mv').innerHeight();

      if($('.block-banner').length > 0){
        pos_bottom = $('.block-banner').offset().top + $('.block-banner').innerHeight();
      }
      
      if($('.header-sub .btn-order').length > 0){
        if(current_scroll_pos > pos_bottom){
          $('.header-sub .btn-order').addClass('is-show')
        }else{
          $('.header-sub .btn-order').removeClass('is-show')
        }
      }
    }
  },

  /**
   * STAFFPICKのリンク先を現在のページに応じてMEN/WOMENに振り分ける
   */
  replaceStaffpickLink: function(){
    var url = location.href;
    var menuLink = $('.header-common a[href^="/staff-pick"], .global-nav a[href^="/staff-pick"]');

    if(url.indexOf('/men') > -1){
      menuLink.attr('href', '/staff-pick/?style=men');
    }

    if(url.indexOf('/women') > -1){
      menuLink.attr('href', '/staff-pick/?style=women');
    }
  },
};

/**
 * SP用メニュー
 */
var spMenu = {
  prevScrollPos: 0, //メニューが開く直前のスクロール位置を格納
  canOpen: true,//連打防止用
  isOpen: false,
  timer: '',

  init: function(){
    spMenu.clickBtn();
    
    $(window).on('resize', function(){
      clearTimeout(spMenu.timer)
      // spMenu.timer = setTimeout(function(){
        if(spMenu.isOpen){
          $('.global-nav').css({
            'height': $(window).innerHeight()
          })
        }
      // }, 100);
    })
  },

  /**
  * バーガーボタンを押したとき
  */
  clickBtn: function(){
    $('#spMenuBtn').on('click', function(){
      if(!spMenu.canOpen) return;//ボタン連打防止

      spMenu.canOpen = false;

      if(spMenu.isOpen){
        spMenu.close();

      }else{
        spMenu.open();
      }
      
      setTimeout(function(){
        spMenu.canOpen = true;
      }, 300);
    });
  },

  /**
   * メニューを開く
   */
  open: function(){
    // $('.global-nav').addClass('on');
    // var $infoArea = $('.area-info');
    // var margin = -current_scroll_pos;

    // if($infoArea.length){
    //   margin = $infoArea.innerHeight() - current_scroll_pos;
    // }

    // spMenu.fixedBody();

    // spMenu.timer = setTimeout(function(){
      $('.global-nav').css({
        'height': $(window).innerHeight()
      })
    // }, 100);
    setTimeout(function(){
      $('.global-nav').addClass('smooth-scroll')
    }, 100)

    spMenu.isOpen = true;
  },

  /**
   * メニューを閉じる
   */
  close: function(){
    // $('.global-nav').removeClass('on');
    // spMenu.unFixedBody();
    spMenu.isOpen = false;
    $('.global-nav').removeClass('smooth-scroll')
  },

  /**
   * メニューを開いているときはBODYを固定
   */
  fixedBody: function(){
    spMenu.prevScrollPos = current_scroll_pos;
    $('body').css({
      'top': -current_scroll_pos,
      'position': 'fixed'
    });
  },

  /**
   * BODYの固定を解除
   */
  unFixedBody: function(){
    $('body').css({
      'top': '',
      'position': ''
    });
    $(window).scrollTop(spMenu.prevScrollPos)
  },
}

/**
 * フェードインアニメーション
 */
var fadeAnim = {
  init: function(){
    fadeAnim.scroll();
    $(window).on('scroll', function(){
      fadeAnim.scroll();
    });
  },
  scroll: function(){
    $('.fade').each(function(){
      var pos = $(this).offset().top;
      var buffer = isSpMode ? 50 : 100;//ウィンドウ下端から要素までの距離

      if($(this).parents('.section').hasClass('section-about')){
        buffer = isSpMode ? 50 : window_height/1.8;//ウィンドウ下端から要素までの距離
      }
      
      if(current_scroll_pos + window_height > pos + buffer){
        $(this).addClass('is-fadein');
      }
    });
  },
}

/**
 * pagetopボタン
 */
var pagetop = {
  $btn: '',
  init: function(){
    pagetop.$btn = $('.to-page-top');
    if($('.to-page-top').length < 1) return;

    $(window).on('scroll resize', function(){
      pagetop.scroll();
    });
  },

  scroll: function(){

    //一定値スクロールしたら表示
    // var show_scroll_value = isSpMode ? 100 : 300;
    // if(current_scroll_pos > show_scroll_value){

    //ページを何割くらいスクロールしたかで判定
    // var document_height = $(document).innerHeight();
    // var scroll_percent = (current_scroll_pos + window_height) / document_height;
    // if(scroll_percent > 0.8){

    //ページ最下部に一定値まで近づいたら表示
    if($('.page-contents').length < 1) return; //ルール破り対策

    var page_contents_pos_bottom = $('.page-contents').offset().top + $('.page-contents').innerHeight();
    var show_buffer = isSpMode ? 900 : 500;
    // console.log(page_contents_pos_bottom + show_buffer);
    
    if(current_scroll_pos + window_height > page_contents_pos_bottom - show_buffer){
      if(current_scroll_pos < 100){
        pagetop.$btn.removeClass('is-show');
      }else{
        pagetop.$btn.addClass('is-show');
      }
    }else{
      pagetop.$btn.removeClass('is-show');
    }

    var footer_pos = $('.footer').offset().top;
    var footer_height = $('.footer').innerHeight();
    var btn_margin = isSpMode ? 20 : 20;
    var footer_btn_height = 0;

    if($('.footer-btn').length > 0){
      footer_btn_height = $('.footer-btn').innerHeight();
    }


    if(current_scroll_pos + window_height > footer_pos + footer_btn_height){
      pagetop.$btn.addClass('is-unfixed');
      pagetop.$btn.css({
        'bottom': footer_height + btn_margin
      });

    }else{
      pagetop.$btn.removeClass('is-unfixed');
      pagetop.$btn.css({
        'bottom': ''
      });
    }
  },
}

/**
 * アンカーリンクをクリック時にスムーススクロール
 */
var smoothScrollOnClickAnchorLink = function() {
  $('body').on('click', 'a[href^="#"]', function () {
    var target = $(this).attr('href');

    if(target != '#top' && target != '#' && $(target).length < 1) return false;

    var speed = 1000;
    var easing = 'easeOutQuart';
    var target_pos = 0;
    var header_height = 0;
    var sub_header_height = 0;

    //サブヘッダーがある場合
    if($('.header-sub').length){
      sub_header_height = $('.header-sub').innerHeight();
      header_height = + sub_header_height;
    }

    if (target === '#top' || target === '#') {
      //pagetop用
      target_pos = 0;
    } else {
      target_pos = $(target).offset().top - header_height;
    }

    //ページ最下部付近のアンカーに飛んだときに、画面がガクッと止まるのを防ぐ
    if(target_pos + window_height > $(document).innerHeight()){
      target_pos = $(document).innerHeight() - window_height
    }

    $('html,body').animate({
      'scrollTop': target_pos
    }, speed, easing);

    return false;
  });
};


/**
 * ページ遷移時のアニメーション
 */
var fadeTransition = {
  $overlay: "",
  speed: 800,
  init: function(){
    var loadTimer;

    fadeTransition.$overlay = $('.transition-overlay');
    if(fadeTransition.$overlay.length < 1) return;

    fadeTransition.catchClickLink();
    // fadeTransition.showContents();

    $(window).on('load', function(){
      clearTimeout(loadTimer)
      fadeTransition.showContents();
    });

    loadTimer = setTimeout(function(){
      fadeTransition.showContents();
    }, 2000);

    window.onpageshow = function(){
      clearTimeout(loadTimer)
      fadeTransition.showContents();
    }
  },
  catchClickLink: function(){
    if(fadeTransition.$overlay.hasClass('fadein-only')) return;
    
    
    $('a.link-transition').on('click', function(){
      if($(this).data('modal-show')) return;
      
      var target = $(this).attr('href');

      if(target.indexOf('#') >= 0){
        // console.log(target.indexOf('#'));
        return
      };

      //別窓リンクの場合はそのまま表示
      if($(this).attr('target') === '_blank'){
        return;
      }
      
      fadeTransition.hideContnts();
      setTimeout(function(){
        window.location = target;
      },fadeTransition.speed)
      
      return false;
    });
  },
  /**
   * ページフェードイン
   */
  showContents: function(){
    setTimeout(function(){
      fadeTransition.$overlay.addClass('is-hide');
    },200);
    setTimeout(function(){
      fadeTransition.$overlay.addClass('is-back');
    },fadeTransition.speed + 200);
  },
  /**
   * ページフェードアウト
   */
  hideContnts: function(){
    fadeTransition.$overlay.removeClass('is-hide is-back').addClass('is-show');
  },
}

/**
 * YOUTUBE API
 */
var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/**
 * APIの準備が終わったら呼ばれる関数
 */
var onYouTubeIframeAPIReady = function() {
  movieModal.isReadyAPI = true;
  if($('.page-contents.top .block-mv.cm').length > 0){
    if(topMv != undefined){
      topMv.initMovie();
    }
  }
  if($('.page-contents.top .section-about').length > 0){
    if(topAboutSection != undefined){
      topAboutSection.initMovie();
    }
  }
  if(movieModal.isCompleteLoad){
    movieModal.initVideos();
  }
};

/**
 * ムービー用モーダル
 */
var movieModal = {
  videos: [],
  isReadyAPI: false,
  isEmbedded: false,
  isCompleteLoad: false,
  isOpen: false,

  init: function(){
    movieModal.clickOpenBtn();
    movieModal.clickCloseBtn();

    //読み込み速度改善のため、ページロードが終わってから動画を読み込む
    $(window).on('load', function(){
      if(movieModal.isReadyAPI){
        movieModal.initVideos();
      }
      movieModal.isCompleteLoad = true;
    });
  },
  
  /**
   * ビデオ埋めこみ
   */
  initVideos: function(){
    $('.movie[data-video-id]').each(function(i){
      var video_container = $(this).attr('id');//iframeに変換される要素のID
      var video_id = $(this).data('video-id');

      movieModal.videos[i] = new YT.Player(video_container, {
        videoId: video_id,
        playerVars: {
          rel: 0,// 関連動画を出さない
          controls: 0,// コントローラーを出さない
          showinfo: 0,// タイトル・動画情報を出さない
        },
        events: {
          'onStateChange': movieModal.checkStatus
        }
      });

      movieModal.isEmbedded = true;
    });
  },

  /**
   * サムネイルをクリックでモーダル表示
   */
  clickOpenBtn: function(){
    $('a[href^="#modal"]').on('click', function(){
      var target = $(this).attr('href');
      movieModal.open(target);
      return false;
    });
  },

  /**
   * モーダル非表示
   */
  clickCloseBtn: function(){
    $('.modal .btn-close, .modal .overlay').on('click', function(){
      var target = $(this).parents('.modal').attr('id');
      target = '#' + target;
      movieModal.close(target);
      return false;
    });
  },

  /**
   * モーダルを開く処理
   */
  open: function(id){
    $(id).addClass('is-show is-active');
    if($(id).find('iframe').length > 0){
      var index = $('.modal-movie').index($(id));
      movieModal.videos[index].playVideo();
    }
    // $(id).parents('.section').addClass('is-show-modal');

    movieModal.fixedBody();
    movieModal.isOpen = true;
    
    setTimeout(function(){
    },500);
  },

  /**
   * モーダルを閉じる処理
   */
  close: function(id){
    $(id).removeClass('is-show');

    if($(id).find('iframe').length > 0){
      var index = $('.modal-movie').index($(id));
      movieModal.videos[index].pauseVideo();
    }

    setTimeout(function(){
      $('.modal').removeClass('is-active');
      // $(id).parents('.section').removeClass('is-show-modal');
    },500);

    movieModal.unFixedBody();
    movieModal.isOpen = false;
  },

  /**
   * モーダルを開いているときはBODYを固定
   */
  fixedBody: function(){
    if(isSpMode) return;
    movieModal.prevScrollPos = current_scroll_pos;
    $('body').css({
      'top': -current_scroll_pos,
      'position': 'fixed',
      'overflow': 'hidden',
      'height': 'auto',
    });
  },

  /**
   * BODYの固定を解除
   */
  unFixedBody: function(){
    if(isSpMode) return;
    $('body').css({
      'top': '',
      'position': '',
      'overflow': '',
      'height': '',
    });
    $(window).scrollTop(movieModal.prevScrollPos)
  },

  /**
   * youtube playerのステータスが変わると発火
   */
  checkStatus: function(event){
    var status = event.data;
    var $modal = $('[data-video-id="' + event.target.playerInfo.videoData.video_id + '"]').parents('.modal');

    switch (status) {
      case YT.PlayerState.PLAYING:
        if(isSpMode){
          $modal.addClass('is-show');
        }
        break;
      case YT.PlayerState.PAUSED:
        if(isSpMode){
          // $modal.removeClass('is-show');
          movieModal.close($modal)
        }
        break;
      case YT.PlayerState.BUFFERING:
        $modal.addClass('is-played is-show');
        break;
      case YT.PlayerState.ENDED:
        movieModal.close($modal)
        event.target.seekTo(0);
        break;
      case -1:
        break;
    }

  },
}

/**
 * キャンペーンバナー
 */
var campaignBanner = {
  init: function(){
    this.$banner = $('.banner-campaign');
    if(this.$banner.length < 1) return;

    this.clickCloseBtn();
  },
  clickCloseBtn: function(){
    var $closeBtn = this.$banner.find('.btn-close');
    $closeBtn.on('click', function(){
      campaignBanner.$banner.addClass('is-hide');
      setTimeout(function(){
        campaignBanner.$banner.addClass('is-unactive');
      },300);
    });
  },
}


/**
 * ご利用ガイド用
 */
var guide = {
  init: function(){
    guide.switchTab();
  },
  /**
   * タブ切り替え（はじめてのお客様内で使用）
   */
  switchTab: function(){
    var tabs = $('.js-tabs') // タブを表す要素を取得
    tabs.each(function(i,el){
      var contentsWrapper = $(el).next('.js-tabs-contents');

      var tab =  $(el).find('.tab') // タブを表す要素を取得
      var contents = $(contentsWrapper).children('.js-tabs-content') // タブに対応する表示領域を取得
      var current_index; // 現在表示中のタブ番号

      for (var i=0; i<tab.length; i++) {
        if (tab[i].classList.contains('current')) {
          current_index = i;
        }

        tab[i].addEventListener('click',(function(i,me){
          return function() {
            switchTab(i);
          };
        })(i,this));

        // 表示内容切り替え処理
        function switchTab(i) {
          tab.removeClass('current');
          contents.removeClass('current');
          tab[i].classList.add('current');
          contents[i].classList.add('current');
          current = i;
        }
      }
    });

    // $('a[data-switch-tab]').each(function(){
    //   var n = parseInt(elem.getAttribute('data-switch-tab'));
    //   $(this).on('click', function(){
    //     e.preventDefault();
    //     switchTab(n);
    //     return false;
    //   })
    // });
  },
}


/**
 * staffpickセクション
 */
var staffpickSection = {
  slider: '',
  init: function(){
    if($('.section-staffpick').length < 1) return;

    //ロード負荷軽減のため、ページロード完了後に実行
    // $(window).on('load', function(){
    // })
    staffpickSection.initSlider();
  },

  /**
   * swiperの設定
   */
  initSlider: function(){
    var nextArrow = '.section-staffpick .slider-arrow-next';
    var prevArrow = '.section-staffpick .slider-arrow-prev';

    staffpickSection.slider = new Swiper('.section-staffpick .slider', {
      loop: true,
      slidesPerView: 4,
      spaceBetween: 40,

      //navigation
      navigation: {
        nextEl: nextArrow,
        prevEl: prevArrow,
        disabledClass: 'slider-arrow-disable'
      },

      //SP用
      breakpoints: {
        750: {
          loop: false,
          slidesPerView: 1.635,
          spaceBetween: 20,
          slidesOffsetBefore: 20,
          slidesOffsetAfter: (window.innerWidth - window.innerWidth * 0.592 - 20),
        }
      },
    });
  },
}

/**
 * suitpediaセクション
 */
var suitpediaSection = {
  init: function(){
    if($('.section-suitpedia').length < 1) return;
    
    suitpediaSection.initSlider();
    // suitpediaSection.formatFirstArticleDate();
  },
  //日付部分の構造変更(日にちだけspanで囲む)
  // formatFirstArticleDate: function(){
  //   var article = $(".section-suitpedia .block-article.first");
  //   var date = article.find(".box-date");
  //   var dateText = date.text();
  //   dateText = dateText.split(".");
  //   dateText[2] = "<span class='day'>" + dateText[2] + "</span>";
  //   date.html(dateText[0] + "." + dateText[1] + dateText[2]);
  // }

  /**
   * swiperの設定
   */
  initSlider: function(){
    var nextArrow = '.section-suitpedia .slider-arrow-next';
    var prevArrow = '.section-suitpedia .slider-arrow-prev';

    staffpickSection.slider = new Swiper('.section-suitpedia .slider', {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 20,

      //navigation
      navigation: {
        nextEl: nextArrow,
        prevEl: prevArrow,
        disabledClass: 'slider-arrow-disable'
      },

      //SP用
      breakpoints: {
        750: {
          loop: false,
          slidesPerView: 1.51,
          spaceBetween: 20,
          slidesOffsetBefore: 20,
          slidesOffsetAfter: 20,
        }
      },
    });
  },
}


/**
 * LOOKS モーダル内、吹き出し表示動作
 */
var balloon = {
  init: function(){
    this.showFirstLookBalloon();

    $('.block-modal .look, .modal-look .look, .block-modal-msuit .look, .block-modal-measy .look, .block-modal-wsuit .look, .block-modal-weasy .look').each(function(i, el){
      var parentSlide = $(el);
      var balloon = parentSlide.find('.balloon-right, .balloon-left');
      var bkBalloon = parentSlide.find('.bk-balloon');
      var ico = parentSlide.find('.box-photo .ico span');
      var img = parentSlide.find('img');

      img.on('click', function(){
        balloon.addClass('is-visible');
        bkBalloon.addClass('is-visible');
        ico.addClass('is-hidden');
      });

      ico.on('click', function(){
        balloon.addClass('is-visible');
        bkBalloon.addClass('is-visible');
        ico.addClass('is-hidden');
      });

      bkBalloon.on('click', function(){
        balloon.removeClass('is-visible');
        bkBalloon.removeClass('is-visible');
        ico.removeClass('is-hidden');
      });
    });
  },

  /**
   * EASYページ内、LOOKの1枚目だけスクロール中に吹き出しを表示
   */
  showFirstLookBalloon: function(){
    $('.section-look-list .modal-look').each(function(i, el){
      var firstLook = $(el).find('.look').eq(0);
      var firstLookPos = $(firstLook).offset().top;

      var balloon = $(firstLook).find('.balloon-right, .balloon-left');
      var bkBalloon = $(firstLook).find('.bk-balloon');
      var ico = $(firstLook).find('.box-photo .ico span');

      var isDisplayed = false;

      $(window).on('scroll', function(){
        if(isDisplayed) return;
        firstLookPos = $(firstLook).offset().top;

        if(firstLookPos < window.pageYOffset + (window.innerHeight * 0.5)){
          balloon.addClass('is-visible');
          bkBalloon.addClass('is-visible');
          ico.addClass('is-hidden');
          isDisplayed = true;

          setTimeout(function() {
            balloon.removeClass('is-visible');
            bkBalloon.removeClass('is-visible');
            ico.removeClass('is-hidden');
          }, 3000);
        }
      });
    });
  },
}

/* ログイン判定のボタン表示 */
var loggedInBtn = {
  init: function(){
    setTimeout(function(){
      $(function() {
        if($('.user-items').hasClass('logged-in')){
          // console.log('logged-in');
          $('.btn-order-v2').css({
            'display': 'none',
          });
          $('.btn-order-v2-login').css({
            'display': '',
          });
        }else{
          // console.log('no-login');
          $('.btn-order-v2').css({
            'display': '',
          });
          $('.btn-order-v2-login').css({
            'display': 'none',
          });
        }
      });
    },1000);
  },
}