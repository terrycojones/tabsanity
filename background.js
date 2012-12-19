var TS = {
    tabs: {},  // key is tab id, values are always true.

    sanityCheck: function(){

        chrome.tabs.query({}, function(tabs){
            // All tab ids that chrome says exists must be in this.tabs
            var idsReceived = {};
            for (var i = 0; i < tabs.length; i++){
                var tabId = [tabs[i].id];
                if (this.tabs[tabId] === undefined){
                    console.log('Tab with id ' + tabId +
                            ' is claimed to exist, but that id has not been seen before.');
                    alert('Unknown tab id given by Chrome. See console for info.');
                }
                idsReceived[tabId] = true;
            }

            // All tab ids that we currently know about must be in the results.
            for (tabId in this.tabs){
                if (this.tabs.hasOwnProperty(tabId)){
                    if (idsReceived[tabId] === undefined){
                        console.log('Tab with id ' + tabId +
                                    ' is known to us, but Chrome has forgotten it.');
                        alert('Tab id not returned by Chrome. See console for info.');
                    }
                }
            }

        }.bind(this));
    },

    mustExist: function(tabId, action){
        if (this.tabs[tabId] === undefined){
            console.log('Tab with id ' + tabId + ' ' + action +
                        ', but that tab id is unknown.');
            alert('Unknown tab ' + action + '. See console for info.');
            return false;
        }
        else {
            return true;
        }
    },

    mustNotExist: function(tabId){
        if (this.tabs[tabId]){
            console.log('A tab with id ' + tabId +
                        ' was just created, but that id is already in use.',
                        this.tabs[tabId]);
            alert('Duplicate tab id. See console for info.');
            return false;
        }
        else {
            return true;
        }
    },

    init: function(){

        chrome.tabs.query({}, function(tabs){
            console.log('Found ' + tabs.length + ' pre-existing tabs.');
            for (var i = 0; i < tabs.length; i++){
                this.tabs[tabs[i].id] = true;
            }
            this.sanityCheck();
            this.initListeners();
        }.bind(this));
    },

    initListeners: function(){

        // Add listeners for the 8 tab events given at
        // https://developer.chrome.com/extensions/tabs.html

        // 1. CREATED
        chrome.tabs.onCreated.addListener(function(tab){
            var tabId = tab.id;
            console.log('Created tag id ' + tabId);
            if (this.mustNotExist(tabId)){
                this.tabs[tabId] = true;
            }
            this.sanityCheck();
        }.bind(this));

        // 2. UPDATED
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
            console.log('Updated (' + changeInfo.status + ') tag id ' + tabId);
            this.mustExist(tabId, 'updated');
            this.sanityCheck();
        }.bind(this));

        // 3. MOVED
        chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
            console.log('Moving tag id ' + tabId);
            this.mustExist(tabId, 'moved');
            this.sanityCheck();
        }.bind(this));

        // 4. ACTIVATED
        chrome.tabs.onActivated.addListener(function(activeInfo){
            var tabId = activeInfo.tabId;
            console.log('Activated tag id ' + tabId);
            this.mustExist(tabId, 'activated');
            this.sanityCheck();
        }.bind(this));

        // 5. HIGHLIGHTED
        chrome.tabs.onHighlighted.addListener(function(info){
            var i, tabId;
            for (i = 0; i < info.tabIds.length; i++){
                tabId = info.tabIds[i];
                console.log('Highlighted tag id ' + tabId);
                this.mustExist(tabId, 'highlighted');
            }
            this.sanityCheck();
        }.bind(this));

        // 6. DETACHED
        chrome.tabs.onDetached.addListener(function(tabId, info){
            console.log('Detached tag id ' + tabId);
            this.mustExist(tabId, 'detached');
            this.sanityCheck();
        }.bind(this));

        // 7. ATTACHED
        chrome.tabs.onAttached.addListener(function(tabId, info){
            console.log('Attached tag id ' + tabId);
            this.mustExist(tabId, 'attached');
            this.sanityCheck();
        }.bind(this));

        // 8. REMOVED
        chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
            console.log('Removing tag id ' + tabId);
            if (this.mustExist(tabId, 'removed')){
                delete this.tabs[tabId];
            }
            this.sanityCheck();
        }.bind(this));
    }
};

TS.init();
