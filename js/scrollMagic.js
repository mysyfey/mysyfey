//;
(function($) { //立即执行函数

    /*

    options: manuallySetElement : function(scroll,flag,element){}

    data-scroll-magic:




        "transfrom":"起始值。前身startVal",
        "transformTo":"目标值。前身endVal",
        "cssAttr":"变化的css属性",
        "attrUnit" : "属性值的单位（默认px，vh，vw, em元素身高比例,pw父元素width,ph父元素height）",
        "beforeAttr" : "属性值前要加的字符",
        "afterAttr" : "属性值后要加的字符",


        //magicClass

        //如果只指定了enterClass并且没有指定magicSpaceHeight，那么就会变成magicLine模式

        "enterClass" : "指定进入magic区域的css类",
        "exitClass" : "指定滚出magic区域后的css类",

        "willChange":"加速属性", deprecated

        "manual" : "对指定的magic元素手动设置数据，前提是在options里提供manuallySetElement的实现，并且会在calcunit最后调用，manual的属性值会被作为flag参数"
        "withViewHeight" : "额外给magicSpaceTop增加视窗高度的百分比数。虽然有了manual手动操作，这个的意义就不打了",
        "sharingMode":"有多个元素在控制同一个"Magic Element"，因此每一个元素都不将管magic区域之前和之后的处理，只管自己区域内的变化",

        "magicSpaceTop":"magic区域的起始偏移量。前身topSpacing",
        "magicSpaceHeight":"magic区域的高度。前身scrollLength",
        "magicElement" : "指定要发生变化的元素id，默认为当前元素。前身elementToAnimate",
        "withViewHeight" : "给起始偏移量加上withViewHeight * viewheight",
        "relativeElement" : "magic区域相对指定id的元素定位。relative必须设为true。前身relativeElementId",
        "relative" : "magic区域相对本元素定位，只要是相对元素定位，必须设为true。前身startWhenEl和relativeToEl" 
        "scrollUnit" : "指定magicSpaceTop和magicSpaceHeight的单位（默认px，vh，em元素身高比例）",

    */

    $.scrollMagic = function(options) {
        if(!options)
            options = {};

        var vwTOpx = function (value) {
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight || e.clientHeight || g.clientHeight;

            var result = (x * value) / 100;
            return result;
        },

        vhTOpx = function (value) {
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight || e.clientHeight || g.clientHeight;

            var result = (y * value) / 100;
            return result;
        },

        pxTOvw = function (value) {
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight || e.clientHeight || g.clientHeight;

            var result = (100 * value) / x;
            return result;
        },

        pxTOvh = function (value) {
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight || e.clientHeight || g.clientHeight;

            var result = (100 * value) / y;
            return result;
        },

        toDecimal = function (x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return;
            }
            f = Math.round(x * 100) / 100;
            return f;
        };
        

        var me = {};
        me.vhTOpx = vhTOpx;
        me.vwTOpx = vwTOpx;
        me.resize = function (){
                for (var i = 0; i < magicElements.length; i++)
                    calcUnit(magicElements[i].animations[0],magicElements[i].relement);

                scroller();
        };



        var magicElements = [],
            //outputEl = $("#aimengxiang"),
            $window = $(window),
            $document = $(document),


            scroller = function() {

                var scrollTop = $window.scrollTop(),
                    documentHeight = $document.height(),
                    dwh = documentHeight - $window.height();
                    

                for (var i = 0, l = magicElements.length; i < l; i++) {

                    var animEl = magicElements[i]

                    for (var ai = 0; ai < animEl.animations.length; ai++) {

                        var anim = animEl.animations[ai],
                            $el = anim.element,
                            scrollStart = anim.scrollStart,
                            scrollEnd = anim.scrollEnd,
                            btm = scrollStart,magicLine = false;
                            if(scrollEnd){
                                btm+=scrollEnd;
                            } else if(anim.enterClass){
                                magicLine = true;
                            }

                        if(anim.id=="chapter-one"){
                         anim.id = anim.id;
                        }


                        //进入magic区域
                        if (scrollTop >= scrollStart && (scrollTop <= btm || magicLine)) {

                            if(anim.enterClass && anim.state != anim.enterClass){
                                $el[0].className = anim.state = anim.enterClass;                        
                            } else if(anim.exitClass && anim.state == anim.exitClass){
                                $el[0].className = anim.state = anim.orignalClasses;
                            }else if(anim.sharingMode && $el[0].className != anim.enterClass){
                                $el[0].className = anim.enterClass; 
                            } 

                            //按滚动比例改变属性

                            if(anim.cssAttr){
                                var scrollPercent = toDecimal((scrollTop - scrollStart) / scrollEnd),
                                offset = toDecimal((anim.to - anim.from) * scrollPercent),
                                value = anim.value = (anim.from + offset);

                                $el.css(anim.cssAttr, (anim.beforeAttr ? anim.beforeAttr : "") + value + (anim.afterAttr ? anim.afterAttr : ""));

                            }

                            
                            

                        //magic区域前
                        } else if(!anim.sharingMode) {

                        if (scrollTop < scrollStart) {

                            if(anim.orignalClasses && anim.state != anim.orignalClasses){
                                $el[0].className = anim.state = anim.orignalClasses;
                            } 
                            //按滚动比例改变属性


                            if (anim.cssAttr && anim.value != anim.from)
                                $el.css(anim.cssAttr, (anim.beforeAttr ? anim.beforeAttr : "") + anim.from + (anim.afterAttr ? anim.afterAttr : ""));


                        //magic区域后
                        } else if (scrollTop > btm) {

                            if(anim.exitClass && anim.state != anim.exitClass){
                                $el[0].className = anim.state = anim.exitClass;                        
                            } else if(anim.enterClass && anim.state == anim.enterClass){
                                $el[0].className = anim.state = anim.orignalClasses;
                            }

                            //按滚动比例改变属性


                            if (anim.cssAttr && anim.value != anim.to)
                                $el.css(anim.cssAttr, (anim.beforeAttr ? anim.beforeAttr : "") + anim.to + (anim.afterAttr ? anim.afterAttr : ""));

                        }
                        }
                    }
                }

            },

            calcUnit = function(anim) {

                const element = anim.relement;


                anim.scrollStart = 0;

                if (anim.attrUnit) {        

                    if (anim.transfrom != 0) {
                        if (anim.attrUnit == "vh")
                            anim.from = vhTOpx(anim.transfrom);
                        else if (anim.attrUnit == "vw")
                            anim.from = vwTOpx(anim.transfrom);
                        else if (anim.attrUnit == "em") {
                            anim.from = anim.element.outerHeight() * anim.transfrom;
                        } else if (anim.attrUnit == "pw"){//edited
                            var parentWidth = anim.element.parent().width();
                            anim.from = parentWidth / 100 * anim.transfrom;
                        }
                    }

                    if (anim.transformTo != 0) {
                        if (anim.attrUnit == "vh")
                            anim.to = vhTOpx(anim.transformTo);
                        else if (anim.attrUnit == "vw")
                            anim.to = vwTOpx(anim.transformTo);
                        else if (anim.attrUnit == "em") {
                            anim.to = anim.element.outerHeight() * anim.transformTo;
                        } else if (anim.attrUnit == "pw"){//edited
                            var parentWidth = anim.element.parent().width();
                            anim.to = parentWidth / 100 * anim.transformTo;
                        }
                             
                    } 

                    //if (anim.transformTo != 0)
                    //    anim.transformTo = anim.attrUnit == "vh" ? vhTOpx(anim.transformTo) : vwTOpx(anim.transformTo);
                }


                if (anim.scrollUnit == "vh") {

                    if (anim.magicSpaceTop != 0)
                        anim.scrollStart = vhTOpx(anim.magicSpaceTop);

                    if (anim.magicSpaceHeight && anim.magicSpaceHeight != 0)
                        anim.scrollEnd = vhTOpx(anim.magicSpaceHeight);

                } else if (anim.scrollUnit == "em") {

                    var height = element.outerHeight();
                    anim.scrollStart = height * anim.magicSpaceTop;

                    if(anim.magicSpaceHeight)
                    {
                        var e = height * anim.magicSpaceHeight;
                        anim.scrollEnd = e > 60 ? e : 60;
                    }
                } else {                    
                    anim.scrollStart = anim.magicSpaceTop;
                    anim.scrollEnd = anim.magicSpaceHeight;
                }


                if (anim.relative) {
                    //console.log("element offset", element.offset());
                    const offset = element.offset().top, ch = document.documentElement.clientHeight;
                    anim.scrollStart += (offset - ch);


                }

                if(anim.withViewHeight){
                    const vh = vhTOpx(anim.withViewHeight);
                    anim.scrollStart += vh;
                }

                if(anim.manual && options.manuallySetElement)
                    options.manuallySetElement(me,anim.manual, anim);


                /*if(anim.id=="sss-border-frame"){
                    console.log(anim);
                }*/
            };

        $(".scroll-magic").each(function(index, el) {

            if (el.dataset.scrollMagic) {

                var animEl = new Object(),$el = $(el);
                animEl.animations = [];
                

                var loadAttr = function(attr) {
                    var anim = eval('(' + attr + ')');
                    anim.from = anim.transfrom;
                    anim.to = anim.transformTo;


                    anim.relement = anim.relativeElement ? $(document.getElementById(anim.relativeElement)) : $el;

                    anim.element =  anim.magicElement ? $(document.getElementById(anim.magicElement)) : $el;
                    
                    anim.id = el.id;
                    
                    calcUnit(anim);

                    anim.onReset = new Event("on_reset");
                    anim.onEnter = new Event("on_enter");
                    anim.onExit = new Event("on_exit");


                    if(anim.enterClass || anim.exitClass){
                        anim.orignalClasses = anim.element[0].className ? anim.element[0].className : "";
                        if(anim.enterClass)
                            anim.enterClass = anim.orignalClasses + " " + anim.enterClass
                        if(anim.exitClass)
                            anim.exitClass = anim.orignalClasses + " " + anim.exitClass
                    }
                    

                    animEl.animations.push(anim);
                };

                loadAttr(el.dataset.scrollMagic);


                if (el.dataset.scrollMagic1)
                    loadAttr(el.dataset.scrollMagic1);

                magicElements.push(animEl);
            }
        });

        if (magicElements.length > 0) {
                //alert("dh "+$document.height()+ "  wd "+$window.height());

            //window.onresize += function(){
                
                //alert("resize  dh "+$document.height()+ "  wd "+$window.height() 
                //    +" inner:"+ window.innerHeight + " outer:" + window.outerHeight);
                //console.log("resize  dh "+$document.height()+ "  wd "+$window.height());
                //console.log("window resize",magicElements);                
            //}
        }

            $(window).scroll(function(event) {
                scroller();
            });

            /*$(window).resize(function() {

            });*/

            scroller();

        return me;
    };


/*
        var a;
        var beforeScrollTop = document.documentElement.scrollTop,
            fn = fn || function() {};
        window.addEventListener("scroll", function() {
            var afterScrollTop = document.documentElement.scrollTop,
                delta = afterScrollTop - beforeScrollTop;
            if( delta === 0 ) return false;
            fn( delta > 0 ? "down" : "up" );
            beforeScrollTop = afterScrollTop;
        }, false);
        var nav = document.getElementById("nav");
        function fn(direction) { 
            // console.log(direction);
   

                nav.className=(direction==="down")?"down":"";        
    
        };
        
        
  */  

})(jQuery);
