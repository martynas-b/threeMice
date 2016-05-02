/**
 * 
 * @version 1.0.2
 * @author  Martynas Beinoras, https://github.com/martynas-b
 *
 */
 
window.ThreeMice = window.ThreeMice || {};

ThreeMice.Events = {
	MOUSEOVER: "mouseover",
	MOUSEOUT: "mouseout"
};

ThreeMice.Options = {
	callbackType: "function"	
};

ThreeMice.log = function (aMsg) {
	console.log("ThreeMice: " + aMsg);
};

ThreeMice.hasMouseOver = function (aObj) {
	var has = false;
	if (aObj && (typeof aObj.mouseover === ThreeMice.Options.callbackType)) {
		has = true;
	}
	return has;
};

ThreeMice.hasMouseOut = function (aObj) {
	var has = false;
	if (aObj && (typeof aObj.mouseout === ThreeMice.Options.callbackType)) {
		has = true;
	}
	return has;
};

ThreeMice.Mouse = function (aOpt) {
	var self = this;
	this.container = document.body;
	this.offset = {top: 0, left: 0};
	this.size = {width: 0, height: 0};
	this.camera = null;
	this.object3d = null;
	this.recursive = false;
	this.mouse = { position: {x: -1, y: -1}, intersected: null };
	this.enabled = true;
	this.enabledEvents = {mouseover: false};
		
	function initOptions (aOpt) {
		if (aOpt) {
			if (aOpt.container) {
				self.container = aOpt.container;
				
				if (self.container !== document.body) {
					self.offset = self.container.getBoundingClientRect();
				}
			}
			if (aOpt.size) {
				self.size = aOpt.size;
			}
			else {
				if (self.container === document.body) {
					self.size.width = window.innerWidth;
					self.size.height = window.innerHeight;
				}
				else {
					self.size.width = self.container.clientWidth;
					self.size.height = self.container.clientHeight;
				}
			}
			if (aOpt.camera) {
				self.camera = aOpt.camera;
			}
			if (aOpt.object3d) {
				self.object3d = aOpt.object3d;
			}
			if (aOpt.recursive) {
				self.recursive = aOpt.recursive;
			}
		}
	}
	
	function setMousePosition (event) {		
		self.mouse.position.x = ((event.clientX - self.offset.left + document.body.scrollLeft) / self.size.width) * 2 - 1;
		self.mouse.position.y = - ((event.clientY - self.offset.top + document.body.scrollTop) / self.size.height) * 2 + 1;
	}
	
	function triggerMouseOut () {
		if (self.mouse.intersected) {
			if (ThreeMice.hasMouseOut(self.mouse.intersected)) {
				self.mouse.intersected.mouseout(self.mouse.intersected);					
			}
		}
		self.mouse.intersected = null;
	}
	
	function triggerMouseOver (aObj) {
		if (ThreeMice.hasMouseOver(aObj)) {
			aObj.mouseover(aObj);
		}
		self.mouse.intersected = aObj;
	}
	
	function onMouseMove (event) {
		if (self.enabled && self.enabledEvents.mouseover) {
			setMousePosition(event);
			var object = getIntersect();
			if (object) {
				if (ThreeMice.hasMouseOver(object) || ThreeMice.hasMouseOut(object)) {
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
		if (self.enabled && self.enabledEvents.mouseover) {
			triggerMouseOut();
		}
	}
	
	function getIntersect () {
		var object = null;

		var vector = new THREE.Vector3( self.mouse.position.x, self.mouse.position.y, 1 );
				
		vector.unproject( self.camera );
		
		var ray = new THREE.Raycaster( self.camera.position, vector.sub( self.camera.position ).normalize() );
		
		var intersects = ray.intersectObjects( self.object3d.children, self.recursive );
		
		if ( intersects.length > 0 ) {
			object = intersects[ 0 ].object;
		}
		
		return object;
	}
		
	function initMouseEvents () {
		if (self.container) {
			self.container.addEventListener( 'mousemove', onMouseMove, false );
			self.container.addEventListener( 'mouseout', onMouseOut, false );
		}
	}
	
	this.set = function (aMesh) {
		aMesh.on = function (aEvt, aCallback) {
			aMesh[aEvt] = aCallback;
			if ((aEvt === ThreeMice.Events.MOUSEOVER) || (aEvt === ThreeMice.Events.MOUSEOUT)) {
				self.enabledEvents.mouseover = true;
			}
		};
		return aMesh;
	};
		
	function init (aOpt) {
		initOptions(aOpt);
		
		if (self.camera && self.object3d) {
			initMouseEvents();
		}
		else {
			self.enabled = false;
			if (!self.camera) {
				ThreeMice.log("Camera was not defined.");
			}
			if (!self.object3d) {
				ThreeMice.log("Object3D was not defined.");
			}
		}				
	}
		
	init(aOpt);	
};
