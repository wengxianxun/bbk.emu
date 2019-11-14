var _options = $cache.get("options") || {
  "taptic": false,
};

var _tapticEnabled = _options["taptic"];

exports.tapticEnabled = () => {
  return _tapticEnabled;
}

exports.open = () => {

  function switchCell(title, on, handler) {
    return {
      type: "view",
      layout: (make, view) => {
        make.left.right.inset(15);
        make.top.bottom.equalTo(0);
      },
      views: [
        {
          type: "label",
          props: {
            text: title
          },
          layout: (make, view) => {
            make.left.equalTo(0);
            make.centerY.equalTo(view.super);
          }
        },
        {
          type: "switch",
          props: {
            on: on
          },
          layout: (make, view) => {
            make.right.equalTo(0);
            make.centerY.equalTo(view.super);
          },
          events: {
            changed: sender => handler(sender.on)
          }
        }
      ]
    }
  }

  let cells = [
    {
      "title": "",
      "rows": [
        switchCell($l10n("TAPTIC_ENABLED"), _tapticEnabled, on => {
          _tapticEnabled = on;
          _options["taptic"] = on;
          saveOptions();
        })
      ]
    }
  ];

  $ui.push({
    props: {
      title: $l10n("SETTINGS")
    },
    views: [
      {
        type: "list",
        props: {
          data: cells
        },
        layout: $layout.fill
      }
    ]
  });
}

function saveOptions() {
  $cache.set("options", _options);
}