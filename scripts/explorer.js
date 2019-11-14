exports.open = () => {
  const files = $file.list("www")
  $ui.render({
    props: {
      title: "BBK.EMU",
      navButtons: [
        {
          symbol: "gear",
          handler: () => {
            const settings = require("./settings");
            settings.open();
          }
        },
        {
          symbol: "questionmark.square",
          handler: () => {
            const readme = require("./readme") ;
            readme.show();
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          data: files
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            const ui = require("./ui");
            const name = files[indexPath.row];
            ui.loadGame(name);
          }
        }
      }
    ]
  });
}