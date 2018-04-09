/**
 * Created by Lenovo on 2018/4/9.
 */
$(function(){
  mui('.mui-scroll-wrapper').scroll({
    indicators: false,
  });
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:500//自动轮播周期，若为0则不自动播放，默认为0；
  });
})