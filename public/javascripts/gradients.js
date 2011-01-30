/*
*! Copyright (c) 2010 Tom Ellis (http://www.webmuse.co.uk)
* Licensed under the MIT License
*/
(function($) {
    // Linear and Radial Gradients get hooks
    
    if( !$.cssHooks )
    {
    	$.error( "jQuery 1.4.3+ is needed for this plugin to work" );
    	return;
    }
    
	var rWhitespace = /\s/,
	cssProps1 = "background backgroundImage listStyleImage",
	cssProps = cssProps1.split(rWhitespace),
	div = document.createElement( "div" ),
    css = "background-image:gradient(linear,left top,right bottom, from(#9f9), to(white));background-image:-webkit-gradient(linear,left top,right bottom,from(#9f9),to(white));background-image:-moz-gradient(linear,left top,right bottom,from(#9f9),to(white));background-image:-o-gradient(linear,left top,right bottom,from(#9f9),to(white));background-image:-ms-gradient(linear,left top,right bottom,from(#9f9),to(white));background-image:-khtml-gradient(linear,left top,right bottom,from(#9f9),to(white));background-image:linear-gradient(left top,#9f9, white);background-image:-webkit-linear-gradient(left top,#9f9, white);background-image:-moz-linear-gradient(left top,#9f9, white);background-image:-o-linear-gradient(left top,#9f9, white);background-image:-ms-linear-gradient(left top,#9f9, white);background-image:-khtml-linear-gradient(left top,#9f9, white);";    
    
    //Add style to element
    div.style.cssText = css;

		
    $.support.linearGradient =
    div.style.backgroundImage.indexOf( "-moz-linear-gradient" )  > -1 ? '-moz-linear-gradient' :
    (div.style.backgroundImage.indexOf( "-webkit-gradient" )  > -1 ? '-webkit-gradient' :
    (div.style.backgroundImage.indexOf( "linear-gradient" )  > -1 ? 'linear-gradient' : false));
    
    
    
    //Remove these as some point not needed
    var webkitlinear = "-webkit-gradient(linear, {position} {colours} )";    
    
    
    //Normalises between Moz/W3c and Webkit
    //Moz/W3c uses shorter position, Webkit uses longer position
	var posLinear = {
	
		"left top" : "left top, right bottom",
		"left bottom" : "left bottom, right bottom",
		"right top" : "right top, left bottom",
		"right bottom" : "right bottom, left bottom",
		"right center" : "right bottom, left bottom",
		"left center" : "left bottom, right bottom",
		"center top" : "left top, left bottom",
		"center bottom" : "left bottom, left top",
		"center center" : "-100% -100%, 0% 0%",
		"top left" : "top left, bottom right",
		"top" : "left top, left bottom",
		"bottom" : "left bottom, left top",
		"left" : "left top, right top",
		"right" : "left top, right top"
	};
    
    
	//Needed as Webkit browsers support gradients differently	
    $.support.isWebkit = ( $.support.linearGradient === "-webkit-gradient" ) ? true : false;
        
	
    if ( $.support.linearGradient && $.support.linearGradient !== "linear-gradient" )
    {
				
		$.each( cssProps, function( i, prop ){
			
			$.cssHooks[prop] = {

        		//'get' not really needed as we only want to be able to override setting a style, not really getting
				set: function( elem, value ) {

					if( /^(.*)(:?linear-gradient|linearGradient)(.*)$/i.test( value ) )
					{
						elem.style[prop] = linearSettings( value );
					}
					else
					{
						//Do default
						elem.style[prop] = value;
					}
				}
			};
		
		});
    
    }
    
    function linearSettings( value ){
    
   
        var parts = /^(.*)(:?linear-gradient|linearGradient)(\()(.*)(\))(.*)$/i.exec( value );
        var details = [], colourFrom, colourTo, position, percentage;
         
        
        //Replaces linear-gradient with browser specific gradient e.g. -moz-linear-gradient
        value = value.replace( parts[2] , $.support.linearGradient );

        details = $.trim(parts[4]).split(",");

        //Only colours passed
        if ( details.length === 2 )
        {
            //need to not overwrite other parts of background settings
            if ( $.support.isWebkit )
            {

                var template = webkitlinear;

				template = template.replace( "{colours}",  "left top, left bottom, from(" + details[0] + "), to(" + details[1] + ")" );
				template = template.replace( "{position}", "" );
                

                value =  parts[1] + template + " " + parts[6];
            }
            
            return value;
        }
        
                
        //Position and 2 ( or more ) Colours set
        position = details[0];
        
        details[1] = $.trim(details[1]);
        
        percentage = (details[1].split(rWhitespace).length !== 1) ? parseInt(details[1].split(rWhitespace)[1])/100 : "0",
        
        colourFrom = "color-stop(" + percentage + "%, " + details[1].split(" ")[0] + ")";
        
        //colourTo
        var otherColours = [];
        colourTo = "";
        
        
        
        var a = 1;
        for ( var i = 2; i < details.length; i++ )
        {
            details[i] = $.trim( details[i] );
            
            percentage = (details[i].split(rWhitespace).length !== 1) ? parseInt(details[i].split(rWhitespace)[1])/100 : Math.round( 100 / (details.length - 2) ) / 100;
            
            percentage = ( i == ( details.length - 1 ) ) ? "100" : ( percentage * a );
            
            otherColours.push ("color-stop(" + percentage + "%, " + details[i].split(rWhitespace)[0] + ")" );
            a++;
        }

        
        colourTo = otherColours.join(", ");
        
        if ( $.support.isWebkit )
        {
            var template = webkitlinear;
            template = template.replace( "{colours}", "," + colourFrom + "," + colourTo );
            
            var pos2 = posLinear[position] || position;

            template = template.replace( "{position}", pos2 );
            
            value =  parts[1] + template + " " + parts[6];
            
        }
        return value;            
    }
    
    div = null;
    
})(jQuery); 
