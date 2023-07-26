(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
        window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
          },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }());
  var Nodes = {
    // Settings
    density: 11,
    drawDistance: 20,
    baseRadius: 1.4,
    maxLineThickness: 0.5,
    reactionSensitivity: 0.5,
    lineThickness: 0.5,
    points: [],
    mouse: {
      x: -1000,
      y: -1000,
      down: false
    },
    animation: null,
    canvas: null,
    context: null,
    imageInput: null,
    bgImage: null,
    bgCanvas: null,
    bgContext: null,
    bgContextPixelData: null,
    init: function() {
      // Set up the visual canvas 
      this.canvas = document.getElementById('canvas');
      this.context = canvas.getContext('2d');
      this.context.globalCompositeOperation = "lighter";
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.canvas.style.display = 'block'
      this.imageInput = document.createElement('input');
      this.imageInput.setAttribute('type', 'file');
      this.imageInput.style.visibility = 'hidden';
      this.imageInput.addEventListener('change', this.upload, false);
      document.body.appendChild(this.imageInput);
      this.canvas.addEventListener('mousemove', this.mouseMove, false);
      this.canvas.addEventListener('mousedown', this.mouseDown, false);
      this.canvas.addEventListener('mouseup', this.mouseUp, false);
      this.canvas.addEventListener('mouseout', this.mouseOut, false);
      window.onresize = function(event) {
        Nodes.canvas.width = window.innerWidth;
        Nodes.canvas.height = window.innerHeight;
        Nodes.onWindowResize();
      }
      // Load image
      this.loadData('data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAfkAAADeCAYAAAA+aHneAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+lpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxMy0xMi0yM1QxMToyNDo0NC0wODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTMtMTItMjRUMDE6MDA6NDQtMTY6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTMtMTItMjRUMDE6MDA6NDQtMTY6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM3OEJCRTlFNjQ1MDExRTNCNzYxODY3MTA5OEFFNzAwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA2NThBRDU4NjQ1MjExRTNCNzYxODY3MTA5OEFFNzAwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVm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');
    },
    preparePoints: function() {
      // Clear the current points
      this.points = [];
      var width, height, i, j;
      var colors = this.bgContextPixelData.data;
      for (i = 0; i < this.canvas.height; i += this.density) {
        for (j = 0; j < this.canvas.width; j += this.density) {
          var pixelPosition = (j + i * this.bgContextPixelData.width) * 4;
          // Dont use whiteish pixels
          if (colors[pixelPosition] > 200 && (colors[pixelPosition + 1]) > 200 && (colors[pixelPosition + 2]) > 200 || colors[pixelPosition + 3] === 0) {
            continue;
          }
          var color = 'rgba(' + colors[pixelPosition] + ',' + colors[pixelPosition + 1] + ',' + colors[pixelPosition + 2] + ',' + '1)';
          this.points.push({
            x: j,
            y: i,
            originalX: j,
            originalY: i,
            color: color
          });
        }
      }
    },
    updatePoints: function() {
      var i, currentPoint, theta, distance;
      for (i = 0; i < this.points.length; i++) {
        currentPoint = this.points[i];
        theta = Math.atan2(currentPoint.y - this.mouse.y, currentPoint.x - this.mouse.x);
        if (this.mouse.down) {
          distance = this.reactionSensitivity * 200 / Math.sqrt((this.mouse.x - currentPoint.x) * (this.mouse.x - currentPoint.x) +
            (this.mouse.y - currentPoint.y) * (this.mouse.y - currentPoint.y));
        } else {
          distance = this.reactionSensitivity * 100 / Math.sqrt((this.mouse.x - currentPoint.x) * (this.mouse.x - currentPoint.x) +
            (this.mouse.y - currentPoint.y) * (this.mouse.y - currentPoint.y));
        }
        currentPoint.x += Math.cos(theta) * distance + (currentPoint.originalX - currentPoint.x) * 0.05;
        currentPoint.y += Math.sin(theta) * distance + (currentPoint.originalY - currentPoint.y) * 0.05;
      }
    },
    drawLines: function() {
      var i, j, currentPoint, otherPoint, distance, lineThickness;
      for (i = 0; i < this.points.length; i++) {
        currentPoint = this.points[i];
        // Draw the dot.
        this.context.fillStyle = currentPoint.color;
        this.context.strokeStyle = currentPoint.color;
        for (j = 0; j < this.points.length; j++) {
          // Distaqnce between two points.
          otherPoint = this.points[j];
          if (otherPoint == currentPoint) {
            continue;
          }
          distance = Math.sqrt((otherPoint.x - currentPoint.x) * (otherPoint.x - currentPoint.x) +
            (otherPoint.y - currentPoint.y) * (otherPoint.y - currentPoint.y));
          if (distance <= this.drawDistance) {
            this.context.lineWidth = (1 - (distance / this.drawDistance)) * this.maxLineThickness * this.lineThickness;
            this.context.beginPath();
            this.context.moveTo(currentPoint.x, currentPoint.y);
            this.context.lineTo(otherPoint.x, otherPoint.y);
            this.context.stroke();
          }
        }
      }
    },
    drawPoints: function() {
      var i, currentPoint;
      for (i = 0; i < this.points.length; i++) {
        currentPoint = this.points[i];
        // Draw the dot.
        this.context.fillStyle = currentPoint.color;
        this.context.strokeStyle = currentPoint.color;
        this.context.beginPath();
        this.context.arc(currentPoint.x, currentPoint.y, this.baseRadius, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fill();
      }
    },
    draw: function() {
      this.animation = requestAnimationFrame(function() {
        Nodes.draw()
      });
      this.clear();
      this.updatePoints();
      this.drawLines();
      this.drawPoints();
    },
    clear: function() {
      this.canvas.width = this.canvas.width;
    },
    // The filereader has loaded the image... add it to image object to be drawn
    loadData: function(data) {
      this.bgImage = new Image;
      this.bgImage.src = data;
      this.bgImage.onload = function() {
        //this
        Nodes.drawImageToBackground();
      }
    },
    // Image is loaded... draw to bg canvas
    drawImageToBackground: function() {
      this.bgCanvas = document.createElement('canvas');
      this.bgCanvas.width = this.canvas.width;
      this.bgCanvas.height = this.canvas.height;
      var newWidth, newHeight;
      // If the image is too big for the screen... scale it down.
      if (this.bgImage.width > this.bgCanvas.width - 100 || this.bgImage.height > this.bgCanvas.height - 100) {
        var maxRatio = Math.max(this.bgImage.width / (this.bgCanvas.width - 100), this.bgImage.height / (this.bgCanvas.height - 100));
        newWidth = this.bgImage.width / maxRatio;
        newHeight = this.bgImage.height / maxRatio;
      } else {
        newWidth = this.bgImage.width;
        newHeight = this.bgImage.height;
      }
      // Draw to background canvas
      this.bgContext = this.bgCanvas.getContext('2d');
      this.bgContext.drawImage(this.bgImage, (this.canvas.width - newWidth) / 2, (this.canvas.height - newHeight) / 2, newWidth, newHeight);
      this.bgContextPixelData = this.bgContext.getImageData(0, 0, this.bgCanvas.width, this.bgCanvas.height);
      this.preparePoints();
      this.draw();
    },
    mouseDown: function(event) {
      Nodes.mouse.down = true;
    },
    mouseUp: function(event) {
      Nodes.mouse.down = false;
    },
    mouseMove: function(event) {
      Nodes.mouse.x = event.offsetX || (event.layerX - Nodes.canvas.offsetLeft);
      Nodes.mouse.y = event.offsetY || (event.layerY - Nodes.canvas.offsetTop);
    },
    mouseOut: function(event) {
      Nodes.mouse.x = -1000;
      Nodes.mouse.y = -1000;
      Nodes.mouse.down = false;
    },
    // Resize and redraw the canvas.
    onWindowResize: function() {
      cancelAnimationFrame(this.animation);
      this.drawImageToBackground();
    }
  }
  setTimeout(function() {
    Nodes.init();
  }, 10);