const constants = require("./constants");
const dispatcher = require("./dispatcher");
const joystick = require("./joystick");
const buttons = require("./buttons");
const builder = require("./builder");
const utility = require("./utility");
const props = builder.props;

exports.loadGame = name => {
  
  $ui.push({
    props: {
      title: name,
      clipsToSafeArea: true,
      homeIndicatorHidden: true
    },
    views: [
      {
        type: "view",
        props: {
          id: "container"
        },
        layout: $layout.fill,
        views: [
          {
            type: "web",
            props: {
              id: "canvas",
              url: `http://localhost:${constants.port}/${encodeURIComponent(name)}/index.html`,
              userInteractionEnabled: false,
              showsProgress: false
            }
          }
        ],
        events: {
          layoutSubviews: sender => {
            let canvas = $("canvas");
            let joystick = $("joystick");
            let buttons = $("buttons");
            let selectStart = $("select-start");
            
            let frame = sender.frame;
            let landscapeMode = frame.width > frame.height;
            let topInset = constants.extendedEdgeInset;
            let bottomInset = landscapeMode ? constants.btnInsetLandscape : constants.btnInsetPortrait;

            if (landscapeMode) {
              // Landscape
              let height = frame.height - constants.canvasBottomInset;
              let width = Math.floor(height * 256 / 240);

              canvas.frame = $rect(
                (frame.width - width) / 2,
                topInset,
                width,
                height
              );

              selectStart.frame = (() => {
                let size = $size(constants.btnSize.startSelect.width * 2 + 10, constants.btnSize.startSelect.height);
                return $rect(
                  frame.width - size.width - constants.btnMargin,
                  constants.btnMargin,
                  size.width,
                  size.height
                );
              })();
            } else {
              // Portrait
              let width = frame.width;
              let height = Math.floor(width * 240 / 256);

              canvas.frame = $rect(
                (frame.width - width) / 2,
                constants.canvasTopInset,
                width,
                height
              );

              selectStart.frame = (() => {
                let size = $size(constants.btnSize.startSelect.width * 2 + 10, constants.btnSize.startSelect.height);
                return $rect(
                  (frame.width - size.width) / 2,
                  frame.height - size.height - constants.btnMargin,
                  size.width,
                  size.height
                )
              })();
            }

            joystick.frame = (() => {
              let size = constants.btnSize.leftRight.width * 2 + constants.btnSize.upDown.width + constants.btnMargin * 2;
              return $rect(
                0,
                frame.height - size - bottomInset + constants.btnMargin,
                size,
                size
              );
            })();
            
            buttons.frame = (() => {
              let width = constants.btnSize.ab.width * 2 + constants.btnMargin * 3;
              let height = width + constants.magicTouchHeight;
              return $rect(
                frame.width - width,
                frame.height - height - bottomInset + constants.btnMargin + constants.magicTouchHeight,
                width,
                height
              );
            })();
          }
        }
      },
      {
        type: "runtime",
        props: {
          id: "joystick",
          view: (() => {
            joystick.$removeAllSubviews();
            return joystick;
          })()
        },
        views: [
          {
            type: "view",
            layout: (make, view) => {
              let margin = constants.btnMargin;
              let insets = $insets(margin, margin, margin, margin);
              make.edges.equalTo(view.super).insets(insets);
            },
            views: [
              {
                type: "label",
                props: props.blackBtn("L", "←"),
                layout: (make, view) => {
                  make.left.equalTo(0);
                  make.centerY.equalTo(view.super);
                  make.size.equalTo(constants.btnSize.leftRight);
                }
              },
              {
                type: "label",
                props: props.blackBtn("R", "→"),
                layout: (make, view) => {
                  make.right.equalTo(0);
                  make.centerY.equalTo(view.super);
                  make.size.equalTo(constants.btnSize.leftRight);
                }
              },
              {
                type: "label",
                props: props.blackBtn("U", "↑"),
                layout: (make, view) => {
                  make.top.equalTo(0);
                  make.centerX.equalTo(view.super);
                  make.size.equalTo(constants.btnSize.upDown);
                }
              },
              {
                type: "label",
                props: props.blackBtn("D", "↓"),
                layout: (make, view) => {
                  make.bottom.equalTo(0);
                  make.centerX.equalTo(view.super);
                  make.size.equalTo(constants.btnSize.upDown);
                }
              }
            ]
          }
        ]
      },
      {
        type: "runtime",
        props: {
          id: "buttons",
          view: (() => {
            buttons.$removeAllSubviews();
            return buttons;
          })()
        },
        views: [
          {
            type: "view",
            layout: (make, view) => {
              let margin = constants.btnMargin;
              let insets = $insets(margin, margin, margin + constants.magicTouchHeight, margin);
              make.edges.equalTo(view.super).insets(insets);
            },
            views: [
              {
                type: "label",
                props: props.redButton("B", "B"),
                layout: (make, view) => {
                  make.left.bottom.equalTo(0);
                  make.size.equalTo(constants.btnSize.ab.height);
                }
              },
              {
                type: "label",
                props: props.redButton("A", "A"),
                layout: (make, view) => {
                  make.right.bottom.equalTo(0);
                  make.size.equalTo(constants.btnSize.ab.height);
                }
              },
              {
                type: "label",
                props: props.redButton("X", "X"),
                layout: (make, view) => {
                  make.right.top.equalTo(0);
                  make.size.equalTo(constants.btnSize.ab.height);
                }
              },
              {
                type: "label",
                props: props.redButton("Y", "Y"),
                layout: (make, view) => {
                  make.left.top.equalTo(0);
                  make.size.equalTo(constants.btnSize.ab.height);
                }
              }
            ]
          }
        ]
      },
      {
        type: "view",
        props: {
          id: "select-start"
        },
        views: [
          {
            type: "button",
            props: props.functionBtn("F1", "F1"),
            layout: (make, view) => {
              make.left.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.startSelect.width);
            }
          },
          {
            type: "button",
            props: props.functionBtn("F2", "F2"),
            layout: (make, view) => {
              make.right.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.startSelect.width);
            }
          }
        ]
      }
    ],
    events: {
      appeared: () => {
        utility.setSwipeBackEnabled(false);
      },
      disappeared: () => {
        utility.setSwipeBackEnabled(true);
      }
    }
  });
  
  ["F1", "F2"].forEach(id => {
    let btn = $(id).runtimeValue();
    btn.$addTarget_action_forControlEvents(dispatcher, "touchDown:", (1 << 0));
    btn.$addTarget_action_forControlEvents(dispatcher, "touchUp:", (1 << 6) | (1 << 7) | (1 << 3) | (1 << 5) | 1 << 8);
  });
}