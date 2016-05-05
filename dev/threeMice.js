/**
 * 
 * @version 1.2.0
 * @author  Martynas Beinoras, https://github.com/martynas-b
 *
 */
 
window.ThreeMice = window.ThreeMice || {};

ThreeMice.Events = {
	MOUSEOVER: "mouseover",
	MOUSEOUT: "mouseout",
	MOUSEDOWN: "mousedown",
	MOUSEUP: "mouseup",
	MOUSECLICK: "mouseclick"
};

ThreeMice.Options = {
	callbackType: "function"	
};

ThreeMice.log = function (aMsg) {
	console.log("ThreeMice: " + aMsg);
};

ThreeMice.hasEvent = function (aObj, aEvt) {
	var has = false;
	if (aObj && (typeof aObj[aEvt] === ThreeMice.Options.callbackType)) {
		has = true;
	}
	return has;
};

ThreeMice.Mouse = function (aOpt) {
	var self = this;
	this.container = null;
	this.offset = {top: 0, left: 0};
	this.size = {width: 0, height: 0};
	this.renderer = null;
	this.camera = null;
	this.controls = null;
	this.positionObject = null;
	this.scene = null;
	this.recursive = false;
	this.mouse = { position: {x: -1, y: -1}, intersected: null, clicked: null };
	this.enabled = true;
	this.enabledEvents = {mousemove: false, mousedown: false};
		
	function initOptions (aOpt) {
		if (aOpt) {
			if (aOpt.renderer) {
				self.renderer = aOpt.renderer;
				
				var parentNode = self.renderer.domElement.parentNode;
				if (parentNode) {
					self.container = parentNode;
					self.offset = self.container.getBoundingClientRect();
					self.size = self.renderer.getSize();
				}
			}
			if (aOpt.camera) {
				self.camera = aOpt.camera;
			}
			if (aOpt.scene) {
				self.scene = aOpt.scene;
			}
			if (aOpt.recursive) {
				self.recursive = aOpt.recursive;
			}
			if (aOpt.controls) {
				self.controls = aOpt.controls;
			}
		}
	}
	
	this.resetSize = function () {
		if (self.container) {
			self.offset = self.container.getBoundingClientRect();
		}
		if (self.renderer) {
			self.size = self.renderer.getSize();
		}
	};
	
	function triggerMouseOver (aObj) {
		if (ThreeMice.hasEvent(aObj, ThreeMice.Events.MOUSEOVER)) {
			aObj.mouseover(aObj);
		}
		self.mouse.intersected = aObj;
	}
	
	function triggerMouseOut () {
		if (self.mouse.intersected) {
			if (ThreeMice.hasEvent(self.mouse.intersected, ThreeMice.Events.MOUSEOUT)) {
				self.mouse.intersected.mouseout(self.mouse.intersected);					
			}
		}
		self.mouse.intersected = null;
	}
	
	function triggerMouseDown (aObj) {
		if (ThreeMice.hasEvent(aObj, ThreeMice.Events.MOUSEDOWN)) {
			aObj.mousedown(aObj);
		}
		self.mouse.clicked = aObj;
	}
	
	function triggerMouseUp (aObj) {
		if (self.mouse.clicked && (self.mouse.clicked === aObj)) {
			if (ThreeMice.hasEvent(aObj, ThreeMice.Events.MOUSEUP)) {
				aObj.mouseup(aObj);
			}
			if (ThreeMice.hasEvent(aObj, ThreeMice.Events.MOUSECLICK)) {
				aObj.mouseclick(aObj);
			}
		}
		self.mouse.clicked = null;
	}
	
	function onMouseMove (event) {
		if (self.enabled && self.enabledEvents.mousemove) {
			setMousePosition(event);
			var object = getIntersect();
			if (object) {
				if (ThreeMice.hasEvent(object, ThreeMice.Events.MOUSEOVER) || ThreeMice.hasEvent(object, ThreeMice.Events.MOUSEOUT)) {
					if (object !== self.mouse.intersected) {
						triggerMouseOut();
						triggerMouseOver(object);
					}
				}
			}
			else {
				triggerMouseOut();				
			}
		}
	}
	
	function onMouseOut (event) {
		if (self.enabled && self.enabledEvents.mousemove) {
			triggerMouseOut();
		}
	}
	
	function onMouseDown (event) {
		if (self.enabled && self.enabledEvents.mousedown) {
			setMousePosition(event);
			var object = getIntersect();
			triggerMouseDown(object);
		}
	}
	
	function onMouseUp (event) {
		if (self.enabled && self.enabledEvents.mousedown) {
			setMousePosition(event);
			var object = getIntersect();
			triggerMouseUp(object);
		}
	}
	
	function setMousePosition (event) {
		var x = 0;
		var y = 0;
		
		if (event.pageX) {
			x = event.pageX;
			y = event.pageY;
		}
		else if (event.touches) {
			x = event.touches[0].pageX;
			y = event.touches[0].pageY;
		}
		else if (event.screenX) {
			x = event.screenX;
			y = event.screenY;
		}		
		
		self.mouse.position.x = ((x - self.offset.left + document.body.scrollLeft) / self.size.width) * 2 - 1;
		self.mouse.position.y = - ((y - self.offset.top + document.body.scrollTop) / self.size.height) * 2 + 1;
	}
	
	function getIntersect () {
		var object = null;

		var vector = new THREE.Vector3( self.mouse.position.x, self.mouse.position.y, 1 );
				
		vector.unproject( self.camera );
						
		var ray = new THREE.Raycaster( self.positionObject.position, vector.sub( self.positionObject.position ).normalize() );
						
		var intersects = ray.intersectObjects( self.scene.children, self.recursive );
		
		if ( intersects.length > 0 ) {
			object = intersects[ 0 ].object;
		}
		
		return object;
	}
		
	function initMouseEvents () {
		if (self.container) {
			self.container.addEventListener( 'mousemove', onMouseMove, false );
			self.container.addEventListener( 'mouseout', onMouseOut, false );
			self.container.addEventListener( 'mousedown', onMouseDown, false );
			self.container.addEventListener( 'mouseup', onMouseUp, false );
			
			self.container.addEventListener( 'touchstart', onMouseDown, false );				
			self.container.addEventListener( 'touchend', onMouseUp, false );
		}
	}
	
	this.set = function (aMesh) {
		aMesh.on = function (aEvt, aCallback) {
			aMesh[aEvt] = aCallback;
			if ((aEvt === ThreeMice.Events.MOUSEOVER) || (aEvt === ThreeMice.Events.MOUSEOUT)) {
				self.enabledEvents.mousemove = true;
			}
			else if ((aEvt === ThreeMice.Events.MOUSEDOWN) || (aEvt === ThreeMice.Events.MOUSEUP) || (aEvt === ThreeMice.Events.MOUSECLICK)) {
				self.enabledEvents.mousedown = true;
			}
		};
		return aMesh;
	};
		
	function init (aOpt) {
		initOptions(aOpt);
						
		if (self.container && self.camera && self.scene) {

			self.positionObject = self.camera;
			if (self.controls) {
				self.positionObject = self.controls.getObject();
			}
			
			initMouseEvents();
		}
		else {
			self.enabled = false;
			if (!self.container) {
				ThreeMice.log("Renderer was not defined or is not appended to DOM.");
			}
			if (!self.camera) {
				ThreeMice.log("Camera was not defined.");
			}
			if (!self.scene) {
				ThreeMice.log("Scene was not defined.");
			}
		}				
	}
		
	init(aOpt);	
};