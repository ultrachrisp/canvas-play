const createObj = () => {
  return {
    xPosition: 0,
    yPosition: 0,
  };
};

function test() {
  return 23;
}

function test2() {
  return 34;
}

export default function Particle() {
  return {
    obj: () => createObj(),
    test: () => test(),
    test2: () => test2(),
  };
}
