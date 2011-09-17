
vichrome.mode = {};

vichrome.mode.Mode = function() { };

// Mode Class prototype definition
(function(o) {
    o.exit = function() {
    };

    o.enter = function() {
    };

    o.reqScrollDown = function() {
        vichrome.view.scrollBy( 0, vichrome.model.getSetting("scrollPixelCount") );
    };

    o.reqScrollUp = function() {
        vichrome.view.scrollBy( 0, -vichrome.model.getSetting("scrollPixelCount") );
    };

    o.reqScrollLeft = function() {
        vichrome.view.scrollBy( -vichrome.model.getSetting("scrollPixelCount"), 0 );
    };

    o.reqScrollRight = function() {
        vichrome.view.scrollBy( vichrome.model.getSetting("scrollPixelCount"), 0 );
    };

    o.reqPageHalfDown = function() {
        vichrome.view.scrollBy( 0, window.innerHeight / 2 );
    };

    o.reqPageHalfUp = function() {
        vichrome.view.scrollBy( 0, -window.innerHeight / 2 );
    };

    o.reqPageDown = function() {
        vichrome.view.scrollBy( 0, window.innerHeight );
    };

    o.reqPageUp = function() {
        vichrome.view.scrollBy( 0, -window.innerHeight );
    };

    o.reqGoTop = function() {
        vichrome.model.setPageMark();
        vichrome.view.scrollTo( window.pageXOffset, 0 );
    };

    o.reqGoBottom = function() {
        vichrome.model.setPageMark();
        vichrome.view.scrollTo( window.pageXOffset, document.body.scrollHeight - window.innerHeight );
    };

    o.reqBackHist = function() {
        vichrome.view.backHist();
    };

    o.reqForwardHist = function() {
        vichrome.view.forwardHist();
    };

    o.reqReloadTab = function() {
        vichrome.view.reload();
    };

    o.reqGoSearchModeForward = function() {
        vichrome.model.enterSearchMode( false );
    };

    o.reqGoSearchModeBackward = function() {
        vichrome.model.enterSearchMode( true );
    };

    o.reqBackToPageMark = function() {
        // TODO:enable to go any pagemark, not only unnamed.
        vichrome.model.goPageMark();
    }

    o.reqBlur = function() {
        vichrome.view.blurActiveElement();

        if( this.blur ) {
            this.blur();
        }
    };

    o.reqGoFMode = function() {
        vichrome.model.enterFMode();
    };

    o.reqGoFModeWithNewTab = function() {
        vichrome.model.enterFMode();
    };

    o.reqGoCommandMode = function() {
        vichrome.model.enterCommandMode();
        vichrome.view.showCommandBox(":", "");
        vichrome.view.focusCommandBox();
    };

}(vichrome.mode.Mode.prototype));


vichrome.mode.NormalMode = function() {
};

vichrome.mode.NormalMode.prototype = new vichrome.mode.Mode();
(function(o) {
    o.prePostKeyEvent = function(key, ctrl, alt, meta) {
        // TODO:some keys cannot be recognized with keyCode e.g. C-@

        return true;
    };

    o.blur = function() {
        vichrome.model.cancelSearchHighlight();
    };

    o.enter = function() {
        vichrome.view.hideCommandBox();
    };

    o.reqFocusOnFirstInput = function() {
        vichrome.model.setPageMark();
        vichrome.view.focusInput( 0 );
    };

    o.reqNextSearch = function() {
        var found = vichrome.model.goNextSearchResult( false );
    };

    o.reqPrevSearch = function() {
        var found = vichrome.model.goNextSearchResult( true );
    };
}(vichrome.mode.NormalMode.prototype));


vichrome.mode.InsertMode = function() {
};

vichrome.mode.InsertMode.prototype = new vichrome.mode.Mode();
(function(o) {
    o.prePostKeyEvent = function(key, ctrl, alt, meta) {
        if( key === vichrome.key.keyCodes.ESC ) {
            return true;
        } else if(vichrome.key.keyCodes.F1 <= key && key <= vichrome.key.keyCodes.F12){
            return true;
        } else if( ctrl ) {
            return true;
        } else {
            // character key do not need to be handled in insert mode
            return false;
        }
    };

    o.blur = function() {
    };

    o.enter = function() {
    };
}(vichrome.mode.InsertMode.prototype));

vichrome.mode.SearchMode = function() {
};

vichrome.mode.SearchMode.prototype = new vichrome.mode.Mode();
(function(o) {
    o.prePostKeyEvent = function(key, ctrl, alt, meta) {
        if( vichrome.view.getCommandBoxValue().length === 0 &&
        key === vichrome.key.keyCodes.BS) {
            setTimeout( function() {
                vichrome.model.cancelSearch();
            }, 0);
        }

        switch(key) {
            case vichrome.key.keyCodes.Tab   :
            case vichrome.key.keyCodes.BS    :
            case vichrome.key.keyCodes.DEL   :
            case vichrome.key.keyCodes.Left  :
            case vichrome.key.keyCodes.Up    :
            case vichrome.key.keyCodes.Right :
            case vichrome.key.keyCodes.Down  :
            case vichrome.key.keyCodes.ESC   :
            case vichrome.key.keyCodes.CR    :
                event.stopPropagation();
                break;
            default:
                break;
        }

        if( key === vichrome.key.keyCodes.ESC ) {
            setTimeout( function() {
                vichrome.model.cancelSearch();
            }, 0);
            return true;
        } else if(vichrome.key.keyCodes.F1 <= key && key <= vichrome.key.keyCodes.F12){
            return true;
        } else if( ctrl ) {
            return true;
        } else if( key === vichrome.key.keyCodes.CR ) {
            setTimeout( function(){
                vichrome.model.enterNormalMode();
            }, 0);
            return false;
        } else {
            return false;
        }
    };

    o.blur = function() {
        vichrome.model.cancelSearch();
    };

    o.enter = function() {
        vichrome.view.focusCommandBox();
    };

    o.reqNextSearch = function() {
        var found = vichrome.model.goNextSearchResult( false );
    };

    o.reqPrevSearch = function() {
        var found = vichrome.model.goNextSearchResult( true );
    };
}(vichrome.mode.SearchMode.prototype));

vichrome.mode.CommandMode = function() {
};
vichrome.mode.CommandMode.prototype = new vichrome.mode.Mode();
(function(o) {
    o.prePostKeyEvent = function(key, ctrl, alt, meta) {
        // TODO:
        return true;
    };

    o.blur = function() {
    };

    o.enter = function() {
    };
}(vichrome.mode.CommandMode.prototype));

vichrome.mode.FMode = function( newWindow ) {
};


vichrome.mode.FMode.prototype = new vichrome.mode.Mode();
(function(o) {
    var currentInput = "",
        hints        = [],
        keys         = "",
        keyLength    = 2,
        newWindow    = newWindow;

    o.hit = function(i) {
        var e = document.createEvent("MouseEvents");

        hints[i].target.focus();
        e.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        hints[i].target.get(0).dispatchEvent(e);
        event.preventDefault();
    };

    o.isValidKey = function(key) {
        var str = String.fromCharCode( key );
        if( str.length === 0 ) {
            return false;
        }
        if( keys.indexOf( str ) < 0 ) {
            return false;
        } else {
            return true;
        }
    };

    o.searchTarget = function() {
        var total = hints.length, i;
        for( i=0; i < total; i++ ) {
            if( currentInput === hints[i].key ) {
                return i;
            }
        }

        return -1;
    };

    o.highlightCandidate = function() {
    };

    o.putValidChar = function(key) {
        var str = String.fromCharCode( key ), idx;

        currentInput += str;
        vichrome.view.setStatusLineText( 'HIT-A-HINT : ' + currentInput );

        if( currentInput.length < keyLength ) {
            this.highlightCandidate();
            return;
        } else {
            idx = this.searchTarget();
            if( idx >= 0 ) {
                this.hit( idx );
            }
            $('span#vichromehint').remove();
            vichrome.model.enterNormalMode();
        }
    };

    o.prePostKeyEvent = function(key, ctrl, alt, meta) {
        if( key === vichrome.key.keyCodes.ESC ) {
            return true;
        }
        if(vichrome.key.keyCodes.F1 <= key && key <= vichrome.key.keyCodes.F12){
            return true;
        }
        if( ctrl ) {
            return true;
        }

        if( this.isValidKey( key ) ) {
            this.putValidChar( key );
        }
        return false;
    };

    o.blur = function() {
        vichrome.model.enterNormalMode();
    };

    o.getKeyLength = function(candiNum) {
        return Math.floor( Math.log( candiNum ) / Math.log( keys.length ) ) + 1;
    };

    o.enter = function() {
        var div, links, total, x, y;
        currentInput = "";
        hints        = [];
        keys         = "";
        keyLength    = 2;
        newWindow    = newWindow;

        keys = vichrome.model.getSetting("fModeAvailableKeys");
        links = $('a:_visible,*:input:_visible');
        keyLength = this.getKeyLength( links.length );
        links.each( function(i) {
            var key='', j, k;
            k = i;
            for( j=0; j < keyLength; j++ ) {
                key += keys.charAt( k % keys.length );
                k /= keys.length;
            }
            hints[i]        = {};
            hints[i].offset = $(this).offset();
            hints[i].key    = key;
            hints[i].target = $(this);

            $(this).addClass('fModeTarget');
        });

        total = hints.length;
        for( i=0; i < total; i++) {
            x = hints[i].offset.left - 10;
            y = hints[i].offset.top  - 10;
            if( x < 0 ) { x = 0; }
            if( y < 0 ) { y = 0; }
            div = $( '<span id="vichromehint" />' )
            .css( "top",  y )
            .css( "left", x )
            .html(hints[i].key);
            $(document.body).append(div);
        }

        vichrome.view.setStatusLineText('HIT-A-HINT : ');
    };

    o.exit = function() {
        $('span#vichromehint').remove();
        $('.fModeTarget').removeClass('fModeTarget');
        vichrome.view.setStatusLineText('');
    };
}(vichrome.mode.FMode.prototype));

$.extend($.expr[':'], {
    _visible: function(elem){
        if($.expr[':'].hidden(elem)) return false;
        if($.curCSS(elem, 'visibility') == 'hidden') return false;
        return true;
    }
});
