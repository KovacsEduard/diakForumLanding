(function(){
    var root=document.querySelector('.lp');
    if(!root||!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    root.classList.add('lp--mozgas');
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){entry.target.classList.add('lp--latszik');observer.unobserve(entry.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    root.querySelectorAll('.lp-szakasz').forEach(function(section){observer.observe(section);});
  })();
