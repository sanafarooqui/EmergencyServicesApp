/* Change the color of element on hover */
(function($){
    $.fn.changeColor = function(){
        $(this).mouseenter(function(){
           // console.log("mouseenter");
            $(this).addClass('colorChange');
        });
    $(this).mouseleave(function(){
       // console.log("leave");
        $(this).css("color","black");
    });
    return $(this);
    }
})(jQuery);


/* Capitalize the first letter */
(function($) { 
    // jQuery plugin definition  
    $.fn.capitalize = function() {  
        
        this.each(function() {   
            // find text  
            var origText = $(this).text(), newText = ''; 
            //change the first letter to uppercase
            newText = origText.charAt(0).toUpperCase() + origText.slice(1);
            $(this).text(newText);   
        });  
     
        return this;  
    };  
})(jQuery);
