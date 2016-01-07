'use strict'

const { utils: Cu } = Components;
const COMMONJS_URI = "resource://gre/modules/commonjs";
const { require } = Cu.import(COMMONJS_URI + "/toolkit/require.js", {});
const { Bootstrap } = require(COMMONJS_URI + "/sdk/addon/bootstrap.js");

var gDomains = ['577578c.ngrok.com'];
var allowDomainsPrefKey = 'media.getusermedia.screensharing.allowed_domains';

var pageMod = require("sdk/page-mod");

/*
var salutation = 'hello, ';
function greetme(user) {
  return salutation + user;
}

exportFunction(greetme, unsafeWindow, {defineAs: 'greetme'});

*/

function startup(aData, aReason) {
  pageMod.PageMod({
    include: gDomains,
    contentScript: 'window.alert("Page matches ruleset");'
  });


  /*
  gBrowser.addEventListener('load', function(event) {
    // this is the content document of the loaded page.
    let doc = event.originalTarget;

    if (doc instanceof HTMLDocument) {
      // is this an inner frame?
      if (doc.defaultView.frameElement) {
        // Frame within a tab was loaded.
        // Find the root document:
        while (doc.defaultView.frameElement) {
          doc = doc.defaultView.frameElement.ownerDocument;
        }
      }
    }
    var el = doc.createElement('p');
    el.innerHTML = 'something';
    doc.body.appendChild(el);
  }, true);
  
  function examplePageLoad(event) {
    if (event.originalTarget instanceof Components.interfaces.nsIDOMHTMLDocument) {
      var win = event.originalTarget.defaultView;
      if (win.frameElement) {
        // Frame within a tab was loaded. win should be the top window of
        // the frameset. If you don't want do anything when frames/iframes
        // are loaded in this web page, uncomment the following line:
        // return;
        // Find the root document:
        win = win.top;
      }
      win.alert('333');
    }
  }

  // do not try to add a callback until the browser window has
  // been initialised. We add a callback to the tabbed browser
  // when the browser's window gets loaded.
  window.addEventListener("load", function () {
    // Add a callback to be run every time a document loads.
    // note that this includes frames/iframes within the document
    //gBrowser.addEventListener("load", examplePageLoad, true);
  }, false);
  */

  console.log('extension startup');

  if (aReason == APP_STARTUP) {
    return;
  }
  var prefs = Components.classes['@mozilla.org/preferences-service;1']
      .getService(Components.interfaces.nsIPrefBranch);
  gDomains.forEach(function(domain){
    var curPref = prefs.getCharPref(allowDomainsPrefKey);
    if (curPref.contains(domain)) {
      return;
    }
    prefs.setCharPref(allowDomainsPrefKey, curPref + ',' + domain);
  });
}

function shutdown(aData, aReason) {
  if (aReason == APP_SHUTDOWN) {
    return;
  }
  var prefs = Components.classes['@mozilla.org/preferences-service;1']
               .getService(Components.interfaces.nsIPrefBranch);
  gDomains.forEach(function(domain){
    var curPref = prefs.getCharPref(allowDomainsPrefKey);
    var newPref = curPref.split(',').filter((pref) => pref.trim() != domain).join(',');
    prefs.setCharPref(allowDomainsPrefKey, newPref);    
  });
}

function install(aData, aReason) {}

function uninstall(aData, aReason) {}
