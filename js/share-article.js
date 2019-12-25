
    var shareModel = {

            /**
             * 分享QQ好友
             * @param  {[type]} title [分享标题]
             * @param  {[type]} url   [分享url链接，默认当前页面链接]
             * @param  {[type]} pic   [分享图片]
             * @return {[type]}       [description]
             */
            shareQQ: function (description, title, pic) {
                var param = {
                    url: window.location.href,
                    desc: '', /*分享理由*/
                    title : title || '', /*分享标题(可选)*/
                    summary : description,/*分享描述(可选)*/
                    pics : pic || '',/*分享图片(可选)*/
                    flash : '', /*视频地址(可选)*/
                    site: '爱梦想公司' /*分享来源 (可选) */
                };
                var s = [];
                for (var i in param) {
                    s.push(i + '=' + encodeURIComponent(param[i] || ''));
                }
                var targetUrl = "http://connect.qq.com/widget/shareqq/iframe_index.html?" + s.join('&') ;
                window.open(targetUrl, 'qq');
            },

           /**
             * 微信分享
             * @return {[type]} [description]
             */
            weixin: function () {
                var url = window.location.href,
                    encodePath = encodeURIComponent(url),
                    targetUrl = 'http://qr.liantu.com/api.php?text=' + encodePath;
                window.open(targetUrl, 'weixin', 'height=320, width=320');
            },

           /**
             * 分享新浪微博
             * @param  {[type]} title [分享标题]
             * @param  {[type]} url   [分享url链接，默认当前页面]
             * @param  {[type]} pic   [分享图片]
             * @return {[type]}       [description]
             */
            sinaWeiBo: function (title, url, pic) {
                var param = {
                    url: url || window.location.href,
                    type: '3',
                    count: '1', /** 是否显示分享数，1显示(可选)*/
                    appkey: '', /** 您申请的应用appkey,显示分享来源(可选)*/
                    title: title || '', /** 分享的文字内容(可选，默认为所在页面的title)*/
                    pic: pic || '', /**分享图片的路径(可选)*/ 
                    ralateUid:'', /**关联用户的UID，分享微博会@该用户(可选)*/
                    rnd: new Date().valueOf()
                }
                var temp = [];
                for( var p in param ) {
                    temp.push(p + '=' +encodeURIComponent( param[p ] || '' ) )
                }
                var targetUrl = 'http://service.weibo.com/share/share.php?' + temp.join('&');
                window.open(targetUrl, 'sinaweibo', 'height=430, width=400');
            }
    };

    $(".sina-share-article").click(function(){
        shareModel.sinaWeiBo(document.title,"","http://www.aomoxo.com/images/aomoxo-icon.svg");
    });

    $(".qq-share-article").click(function(){
        shareModel.shareQQ("",document.title,"http://www.aomoxo.com/images/aomoxo-icon.svg");
    });

    $(".weixin-share-article").click(function(){
        shareModel.weixin();
    });

    $(".facebook-share-article").click(function(){
        window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href), 
      'facebook-share-dialog', 
      'width=626,height=436');
    });

    $(".twitter-share-article").click(function(){
        window.open('https://twitter.com/intent/tweet?url='+encodeURIComponent(location.href) + '&text=' + encodeURIComponent(document.title), 
      'facebook-share-dialog', 
      'width=626,height=436');
    });

    var copying = false;

    $(".copy-article-link").click(function(){

         if(copying)
          return;

         var textArea = document.createElement("textarea");
          textArea.style.position = 'fixed';
          textArea.style.top = '0';
          textArea.style.left = '0';
          textArea.style.width = '2em';
          textArea.style.height = '2em';
          textArea.style.padding = '0';
          textArea.style.border = 'none';
          textArea.style.outline = 'none';
          textArea.style.boxShadow = 'none';
          textArea.style.background = 'transparent';
          textArea.value = location.href;
          document.body.appendChild(textArea);
          textArea.select();
          try {

            var successful = document.execCommand('copy');
            //var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
            //alert(msg);
            var popUp = document.createElement("div");
            popUp.classList.add("black-pop-up");
            popUp.innerHTML = "已将网址复制到剪贴板";
            $(".copy-article-link").append(popUp);
            popUp.classList.add("show");

            setTimeout(() => {
                $(".copy-article-link")[0].removeChild(popUp);
                copying=false;
            }, 2000);
           
          } catch (err) {
            //alert('该浏览器不支持点击复制到剪贴板');
          }
          document.body.removeChild(textArea);
          copying = true;


    });
