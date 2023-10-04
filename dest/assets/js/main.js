


   
   const swiper = new Swiper('.swipefv', {
     // Optional parameters
     loop: true,
     slidesPerView: 1,
     effect: "fade",
     autoplay: {
       delay: 2000 //3秒ごとにスライダを切り替える
     },
   
   });
   
   
   
   //画面高さを引く（スクロール量）
   const tamifooter = document.getElementById('tamiinquiery');
   const tamiAncor = document.getElementById('tamiBtn');
   
   let footDistance = tamifooter.getBoundingClientRect().top + window.scrollY;
   let wHeight = window.innerHeight; 
   let footerD = (footDistance - wHeight) + 100;
   
   // const li = document.querySelectorAll('#uptshoplist__area li');
   
   
   window.addEventListener("scroll", function(){
       
   
       // 現在の縦方向のスクロール位置を変数 y に格納
       let y = window.scrollY;
   
       //フッター行ったら、表示しないよ
       if(y >= footerD){
           tamiAncor.classList.add('is-hidden');
       }else{
           tamiAncor.classList.remove('is-hidden');
       }
   
   
   
   });
   
   
