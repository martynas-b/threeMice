# ThreeMice

Lightweight javascript library for mouse events in [three.js] (https://github.com/mrdoob/three.js) 3D world.

## Available events

* mouseover
* mouseout
* mousedown (touchstart)
* mouseup (touchend)
* mouseclick (touchstart -> touchend)

## Usage

Download minified file from build directory and include it in your HTML page:

```html
<script src="js/threeMice.min.js"></script>
```

Create ThreeMice instance (or more instances if you want to use it in several renderers):

```javascript
var mouse = new ThreeMice.Mouse({
			renderer: renderer,
			camera: camera,
			scene: scene,
			recursive: true
		});
```

Constructor properties:

```javascript
renderer // (required) - renderer
camera // (required) - camera
scene // (required) - scene or object3D container where mouse events will be triggered. If you know that mouse events will only be used for meshes in some specific object3D container then specify it here instead of whole scene.
recursive // (optional) - defines if mouse events should be searched and triggered recursively in each object children. Default is false.
controls // (optional) - might be needed for camera position detection in specific cases lets say when PointerLockControls are used.
```

Setting events on meshes:

```javascript
mouse.set(mesh).on(event_name, callback_function);
```
or
```javascript
mouse.set(mesh).on(event_name, function (object) {

});
```
* *event_name* - "mouseover", "mouseout", "mousedown" (works as *touchstart* on touchscreens), "mouseup" (works as *touchend* on touchscreens), "mouseclick" (works as *touchstart -> touchend* on touchscreens)
* *callback_function* - function which will be called on event. Returns object (mesh) itself as a function parameter.

Other methods:

```javascript
.resetSize ()
```

When renderer size changes (for example device orientation goes from portrait to landscape) it's needed to call this method which detects new renderer size.

## Examples

Simple ThreeMice mouseover and mouseout events example:

[threeMice_mouseover.html] (examples/threeMice_mouseover.html)

Mouseclick example:

[threeMice_mouseclick.html] (examples/threeMice_mouseclick.html)

