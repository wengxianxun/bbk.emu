require("./base");

const constants = require("./constants");
const width = constants.btnSize.leftRight.width;
const height = constants.btnSize.leftRight.height;

$define({
  type: "Joystick: BitBoxButton",
  events: {
    "getKeyCode:": touches => {
      let touch = touches.$anyObject();
      let pt = touch.$locationInView(self);
      let x = pt.x;
      let y = pt.y;

      let l = x < width;
      let r = x > width + height;
      let u = y < width;
      let d = y > width + height;
      
      let vl = width - x;
      let vr = x - width - height;
      let vu = width - y;
      let vd = y - width - height;

      if (l && u) {
        return vl > vu ? "L" : "U";
      } else if (l && d) {
        return vl > vd ? "L" : "D";
      } else if (r && u) {
        return vr > vu ? "R" : "U";
      } else if (r && d) {
        return vr > vd ? "R" : "D";
      }
      
      if (l) {
        return "L";
      } else if (r) {
        return "R";
      } else if (u) {
        return "U";
      } else if (d) {
        return "D";
      }

      return "#";
    },
  }
});

let joystick = $objc("Joystick").$new();
module.exports = joystick;