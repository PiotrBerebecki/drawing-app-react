import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      canvas: null,
      ctx: null,
      strokeStyle: '#03A9F4',
      inputSize: 3,
      lineWidth: 30,
      isDrawing: false,
      lastX: null,
      lastY: null
    };
    this.updateColor = this.updateColor.bind(this);
    this.updateSize = this.updateSize.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.finishDrawing = this.finishDrawing.bind(this);
    
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }
  
  componentDidMount() {
    const { canvas } = this.refs;
    const ctx = canvas.getContext('2d');
    
    this.setState({
      canvas: canvas,
      ctx: ctx
    }, () => this.initCanvas());
  }
  
  initCanvas() {
    const { canvas, ctx, lineWidth, strokeStyle } = this.state;
    
    [canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];
    
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }
  
  updateColor(e) {
    const newColor = e.target.value;
    const { ctx } = this.state;
    
    this.setState({
      strokeStyle: newColor
    }, () => { ctx.strokeStyle = newColor; });
  }
  
  updateSize(e) {
    const newSize = e.target.value;
    const newLineWidth = newSize * 10;
    const { ctx } = this.state;
    
    this.setState({
      inputSize: newSize,
      lineWidth: newLineWidth
    }, () => { ctx.lineWidth = newLineWidth; });
  }
  
  handleMouseDown(e) {
    const { offsetX, offsetY } = e.nativeEvent;
    this.setState({
      isDrawing: true,
      lastX: offsetX,
      lastY: offsetY
    });
  }
  
  handleMouseMove(e) {
    if (!this.state.isDrawing) { return; }
    const { ctx, lastX, lastY } = this.state;
    const { offsetX, offsetY } = e.nativeEvent;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    
    this.setState({
      lastX: offsetX,
      lastY: offsetY
    });
  }
  
  handleTouchMove(e) {
    if (!this.state.isDrawing) { return; }
    const { ctx, lastX, lastY } = this.state;
    const { clientX, clientY } = e.nativeEvent.touches[0];
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(clientX, clientY);
    ctx.stroke();
    
    this.setState({
      lastX: clientX,
      lastY: clientY
    });    
  }
  
  handleTouchStart(e) {
    e.preventDefault();
    const { clientX, clientY } = e.nativeEvent.touches[0];
    
    this.setState({
      isDrawing: true,
      lastX: clientX,
      lastY: clientY
    });
  }
  
  
  finishDrawing() {
    this.setState({
      isDrawing: false
    });
  }
  
  render() {
    
    console.log(this.state);
    const { strokeStyle, inputSize } = this.state;
    
    return (
      <div className="container">
        <canvas 
          id="canvas" 
          ref="canvas"
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.finishDrawing}
          onMouseOut={this.finishDrawing}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.finishDrawing}
        >
        </canvas>

        <form className="controls" id="form">

          <input 
            type="range" 
            className="controls-input controls-size" 
            value={inputSize}
            onChange={this.updateSize}
            min="1" 
            max="10" 
            id="size"
          />
          
          <input
            type="color"
            className="controls-input controls-color" 
            value={strokeStyle}
            onChange={this.updateColor}
            pattern="^#([A-Fa-f0-9]{6})$"
            required 
            title="Hexadecimal value required"
            id="color"
          />
          
          <button type="button" className="controls-input controls-clear" id="clear">
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </button>
          
          <a className="controls-input controls-download" id="save" href="#" 
             download="drawing.png" target="_blank">
            <i className="fa fa-download" aria-hidden="true"></i>
          </a>
          
        </form>
      </div>
    );
  }
}

export default App;
