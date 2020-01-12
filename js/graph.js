        $(".graph-bar-high").each(function(index, el) {
            calculateProgress(true,$(el))
        });

        $(".graph-bar-low").each(function(index, el) {
            calculateProgress(false,$(el))
        });

        function calculateProgress(high,progressBar) {
            var parent = progressBar.parent().parent().parent()[0];
            var total = parent.dataset.total;
            var completion = parent.dataset.progress;
            var mobile = window.matchMedia('(max-width:767px)');
            var progress = high ? completion : total - completion ;

            //niece.text(progress);

            if(high){
                var progressSize = progress / total * (mobile.matches ? 365 : progressBar.parent().parent().width());
                progressBar.parent().css(mobile.matches ? "height" : "width",progressSize);
            }else 
                progressBar.parent().css(mobile.matches ? "height" : "width","100%");

            var niece = progressBar.next().first()[0].children[0];    
            niece.innerText= progress;/*high ? Math.round(progress / total * 100) : 
                                    100 - Math.round(completion / total * 100);*/
            
        }