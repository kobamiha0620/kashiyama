//webp対応
async function supportsWebp() {
    if (!self.createImageBitmap) return false;
    
    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    const blob = await fetch(webpData).then(r => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
    
  }
  
  (async () => {
    if(await supportsWebp()) {
      console.log('does support');
    }
    else {
      console.log('does not support');
    }
  })();


  const addWebpDetectionClass = () => {
    if (supportsWebp()) {
      document.body.classList.add('is-webp');

    } else {
        document.body.classList.add('is-no-webp');
    }
  };
  
  addWebpDetectionClass(); 
  


  //アコーディオン
  const accTtls = Array.from(document.querySelectorAll('.faq__accordion--ttl'));

  accTtls.forEach((item) => {
    item.addEventListener('click', function() {
      this.classList.toggle('active');
      const accCnt = this.nextElementSibling;
      if (accCnt.style.maxHeight) {
        accCnt.style.maxHeight = null;
      } else {
        accCnt.style.maxHeight = accCnt.scrollHeight + 'px';
      }
    });
  });



  //loadでふわっと表示
  function load_effect() {
    var element = document.getElementsByClassName('load-active');
    if(!element) return; // 要素がない場合は終了
    
    for(var i = 0; i < element.length; i++) { 
      element[i].classList.add('is-show');
    }
  }
  setTimeout(load_effect, 200); // 600ミリ秒経過後に実行

$(function(){
  //ページ内
  $('#footerBtn').click(function() {
    var speed = 500; // スクロール速度(ミリ秒)
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $('html').animate({scrollTop:position}, speed, 'swing');
    return false;
});
});
