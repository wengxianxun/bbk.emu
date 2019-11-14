exports.show = () => {
  $ui.push({
    props: {
      title: $l10n("ABOUT")
    },
    views: [
      {
        type: "markdown",
        props: {
          content: (() => {
            return $file.read("README.md").string;
          })()
        },
        layout: $layout.fill
      }
    ]
  });
}