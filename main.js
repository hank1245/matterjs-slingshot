// module aliases
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
  },
});

// create two boxes and a ground
const ground = Bodies.rectangle(1200, 500, 300, 20, { isStatic: true });

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: { visible: true },
  },
});
render.mouse = mouse;

let ball = Matter.Bodies.circle(400, 300, 20);
let sling = Matter.Constraint.create({
  pointA: { x: 400, y: 300 },
  bodyB: ball,
  stiffness: 0.1,
});

let stack = Matter.Composites.stack(1100, 270, 4, 4, 00, 0, function (x, y) {
  return Matter.Bodies.polygon(x, y, 8, 30);
});

let firing = false;
Matter.Events.on(mouseConstraint, "enddrag", function (e) {
  if (e.body === ball) firing = true;
});
Matter.Events.on(engine, "afterUpdate", function () {
  if (
    firing &&
    Math.abs(ball.position.x - 400) < 20 &&
    Math.abs(ball.position.y - 300) < 20
  ) {
    ball = Matter.Bodies.circle(400, 300, 20);
    Matter.World.add(engine.world, ball);
    sling.bodyB = ball;
    firing = false;
  }
});

// add all of the bodies to the world
Matter.World.add(engine.world, [stack, ground, ball, sling, mouseConstraint]);

// run the renderer
Render.run(render);

// create runner
const runner = Runner.create();

// run the engine
Runner.run(runner, engine);
