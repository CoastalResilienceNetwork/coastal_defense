
// Plugins should load their own versions of any libraries used even if those libraries are also used 
// by the GeositeFramework, in case a future framework version uses a different library version. 

require({
    // Specify library locations.
    // The calls to location.pathname.replace() below prepend the app's root path to the specified library location. 
    // Otherwise, since Dojo is loaded from a CDN, it will prepend the CDN server path and fail, as described in
    // https://dojotoolkit.org/documentation/tutorials/1.7/cdn
    packages: [
	    {
	        name: "jquery",
	        location: "//ajax.googleapis.com/ajax/libs/jquery/1.9.0",
	        main: "jquery.min"
	    },
		{
	        name: "underscore",
	        location: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4",
	        main: "underscore-min"
	    },
			//         {
			//             name: "extjs",
			// location: location.pathname.replace(/\/[^/]+$/, "") + "plugins/coastal_defense/lib/ext-4.2.1-gpl",
			//             main: "ext-all"
			//         },
        {
            name: "tv4",
            location: location.pathname.replace(/\/[^/]+$/, "") + "plugins/coastal_defense/lib",
            main: "tv4.min"
        },
        {
            name: "jquery_ui",
            location: "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1",
            main: "jquery-ui.min"
        }
		
		

    ]
});





define([
        "dojo/_base/declare",
        "framework/PluginBase",
		"jquery",
		"dojo/parser",
		"dijit/registry",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/_base/lang",
		"dojo/query",
		"use!underscore", 
		"./app",
		"dojo/text!plugins/coastal_defense/cd_region.json",
		"dojo/text!plugins/coastal_defense/cd_interface.json"
       ],
       function (declare, PluginBase, $, parser, registry, domClass, domStyle, lang, query, _, cd, configFile, interfaceConfigFile) {
           return declare(PluginBase, {
               toolbarName: "Coastal Defense",
               toolbarType: "sidebar",
			   resizable: false,
			   showServiceLayersInLegend: true,
               allowIdentifyWhenActive: false,
			   infoGraphic: "plugins/coastal_defense/CoastalDefense_c.jpg",
			   pluginDirectory: "plugins/coastal_defense",
			   width: 835,
			   height: 625,
			   _state: {},
			   _deactivated: false,
			   
               activate: function () {
					self = this;
					var showInfoGraphic = localStorage.getItem(this.toolbarName + " showinfographic");
					console.log(this._state);
					if (( showInfoGraphic === "true" || showInfoGraphic == null) && _.isEmpty(this._state) && !this._deactivated) {
					   var pluginId = this.container.parentNode.parentNode.id;
					   var introPanelButton = dojo.query("#" + pluginId + " .plugin-infographic  [widgetid*='Button']")[0];
					   dojo.connect(introPanelButton, "onclick", function() {
					   		self.cdTool.showTool(self.cdTool);
					   });
					} else {
						this.cdTool.showTool(this.cdTool);
						if (!_.isEmpty(this._state)) {
							this.cdTool._state = lang.clone(this._state);
							this._state = {};
							this.cdTool.setState(this.cdTool._state);
						}
						this._deactivated = false;
					}
					cdTool = this.cdTool;
			   },
			   
               deactivate: function () { 
					this._deactivated = true;					
			   },
			   
               hibernate: function () {
					if (this.cdTool.profileTransect){
						this.cdTool.profileTransect.hide();
					}
					if (this.cdTool.profilePolygon){
						this.cdTool.profilePolygon.hide();
					}
					if (this.cdTool.habitatLayer){
						this.cdTool.habitatLayer.hide();
					} 
					this._deactivated = true;					
			   },
			   
               initialize: function (frameworkParameters) {
				   declare.safeMixin(this, frameworkParameters); 
	               var djConfig = {
	                   parseOnLoad: true
	               };
				   self = this;
				   domClass.add(this.container, "claro");
				   this.cdTool = new cd(this, configFile, interfaceConfigFile);
				   this.cdTool.initialize(this.cdTool);
			   },
				   
               getState: function () {
				  var state = this.cdTool.getState();
				  console.log(state);
				  return state; 
	 		   	},
				
               setState: function (state) { 
					this._state = state;
			   },
			   
			   identify: function(){
			   
			   }
           });
       });
