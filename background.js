var TS = {
    tabs: {},  // key is tab id.
    
    sanityCheck: function(callback){
        
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

    init: function(){
        
        chrome.tabs.query({}, function(tabs){
            console.log('Found ' + tabs.length + ' pre-existing tabs.');
            for (var i = 0; i < tabs.length; i++){
                this.tabs[tabs[i].id] = {
                    url: tabs[i].url
                };
            }
        }.bind(this));
        
        this.sanityCheck();
        this.initListeners();
    },

    initListeners: function(){

        chrome.tabs.onCreated.addListener(function(tab){
            var tabId = tab.id;
            console.log('Created tag id ' + tabId);
            if (this.tabs[tabId]){
                console.log('A tab with id ' + tabId +
                            ' was just created, but that id is already in use.',
                            this.tabs[tabId]);
                alert('Duplicate tab id. See console for info.');
            }
            else {
                this.tabs[tabId] = {
                    url: tab.url
                };
            }
            this.sanityCheck();
        }.bind(this));

        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
            console.log('Updated tag id ' + tabId);
            if (this.tabs[tabId] === undefined){
                console.log('Tab with id ' + tabId +
                            ' just updated, but that id has not been seen before.');
                alert('Unknown tab updated. See console for info.');
            }
            else {
                this.tabs[tabId].url = tab.url;
            }
            this.sanityCheck();
        }.bind(this));
        
        chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
            console.log('Moving tag id ' + tabId);
            if (this.tabs[tabId] === undefined){
                console.log('Tab with id ' + tabId +
                            ' is being moved, but that id has not been seen before.');
                alert('Unknown tab moved. See console for info.');
            }
            this.sanityCheck();
        }.bind(this));

        chrome.tabs.onActivated.addListener(function(activeInfo){
            var tabId = activeInfo.tabId;
            console.log('Activated tag id ' + tabId);
            if (this.tabs[tabId] === undefined){
                console.log('Tab with id ' + tabId +
                            ' just activated, but that id has not been seen before.');
                alert('Unknown tab activated. See console for info.');
            }
            this.sanityCheck();
        }.bind(this));

        chrome.tabs.onHighlighted.addListener(function(info){
            var i, tabId;
            for (i == 0; i < info.tabIds.length; i++){
                tabId = info.tabIds[i];
                console.log('Highlighted tag id ' + tabId);
                if (this.tabs[tabId] === undefined){
                    console.log('Tab with id ' + tabId +
                                ' just highlighted, but that id has not been seen before.');
                    alert('Unknown tab highlighted. See console for info.');
                }
            }
            this.sanityCheck();
        }.bind(this));

        chrome.tabs.onDetached.addListener(function(tabId, info){
            console.log('Detached tag id ' + tabId);
            if (this.tabs[tabId] === undefined){
                console.log('Tab with id ' + tabId +
                            ' just detached, but that id has not been seen before.');
                alert('Unknown tab detached. See console for info.');
            }
            this.sanityCheck();
        }.bind(this));

        chrome.tabs.onAttached.addListener(function(tabId, info){
            console.log('Attached tag id ' + tabId);
            if (this.tabs[tabId] === undefined){
                console.log('Tab with id ' + tabId +
                            ' just attached, but that id has not been seen before.');
                alert('Unknown tab attached. See console for info.');
            }
            this.sanityCheck();
        }.bind(this));
        
        chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
            console.log('Removing tag id ' + tabId);
            if (this.tabs[tabId] === undefined){
                console.log('Tab with id ' + tabId +
                            ' is being removed, but that id has not been seen before.');
                alert('Unknown tab removed. See console for info.');
            }
            else {
                delete this.tabs[tabId];
            }
            this.sanityCheck();
        }.bind(this));
    }
};

TS.init();
