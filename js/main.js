window.addEvent('domready', function() {

	var the_content = $$('.cd-dropdown-content')[0]
	var the_wrapper = $$('.cd-dropdown-wrapper')[0]

	//open/close mega-navigation
	$$('.cd-dropdown-trigger')[0].addEvent('click', function(event){
		event.preventDefault();
		toggleNav();
	});

	//close meganavigation
	$$('.cd-dropdown .cd-close')[0].addEvent('click', function(event){
		event.preventDefault();
		toggleNav();
	});

	//on mobile - open submenu
	$$('.has-children').each(function(child){
		child.getChildren('a').addEvent('click', function(event){
			//prevent default clicking on direct children of .has-children 
			event.preventDefault();
			var selected = $(this);
			var selected_ul = selected.getNext('ul')
			selected.getNext('ul').removeClass('is-hidden')
			selected_ul.getParent('.has-children').getParent('ul').addClass('move-out');
		});
	});

	//on desktop - differentiate between a user trying to hover over a dropdown item vs trying to navigate into a submenu's contents
	var submenuDirection = ( !the_wrapper.hasClass('open-to-left') ) ? 'right' : 'left';
  var menuAim = new MenuAim(the_content, {
        activate: function(row) {
        	$(row).getChildren().addClass('is-active').removeClass('fade-out');
        	if ( the_content.getElements('.fade-in').length == 0 ) $(row).getChildren('ul').addClass('fade-in');
        },
        deactivate: function(row) {
        	root = row.getParents('li').getLast() || row

        	var same_path = false
        	$$('li.has-children:hover').each(function(obj){
        		root_hover = obj.getParents('li').getLast() || obj
        		same_path = same_path || root.match($(root_hover))
        	})

        	if( $$('li.has-children:hover').length == 0 || !same_path ) {
        		$(root).getElements('.is-active').removeClass('is-active');
        		// the_content.getElements('.fade-in').removeClass('fade-in')
        		// $(row).getChildren('ul').addClass('fade-out')
        	}
        },
        exitMenu: function() {
        	the_content.getElements('.is-active').removeClass('is-active');
        	return true;
        },
        submenuDirection: submenuDirection,
    });

	//submenu items - go back link
	$$('.go-back').addEvent('click', function(){
		var selected = $(this),
			visibleNav = $(this).getParent('ul').getParent('.has-children').getParent('ul');
		selected.getParent('ul').addClass('is-hidden').getParent('.has-children').getParent('ul').removeClass('move-out');
	}); 

	function toggleNav(){
		var navIsVisible = ( !$$('.cd-dropdown')[0].hasClass('dropdown-is-active') ) ? true : false;
		$$('.cd-dropdown')[0].toggleClass('dropdown-is-active', navIsVisible);
		$$('.cd-dropdown-trigger')[0].toggleClass('dropdown-is-active', navIsVisible);
		if( !navIsVisible ) {
			var one = function(){
				$$('.has-children ul').addClass('is-hidden');
				$$('.move-out').removeClass('move-out');
				$$('.is-active').removeClass('is-active');
			}
			$$('.cd-dropdown')[0].addEvent('webkitTransitionEnd:once',one)
			$$('.cd-dropdown')[0].addEvent('otransitionend:once',one)
			$$('.cd-dropdown')[0].addEvent('oTransitionEnd:once',one)
			$$('.cd-dropdown')[0].addEvent('msTransitionEnd:once',one)
			$$('.cd-dropdown')[0].addEvent('transitionend:once',one)
		}
	}

	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
		  	}
		}).blur(function() {
		 	var input = $(this);
		  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
		  	}
		}).blur();
		$('[placeholder]').getParents('form').submit(function() {
		  	$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
			 		input.val('');
				}
		  	})
		});
	}
});