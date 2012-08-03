CmdUtils.makeSearchCommand({
  names: ["DuckGo"],
  url: "http://duckduckgo.com/?q={QUERY}",
  icon: "http://duckduckgo.com/favicon.ico",
  description: "Search DuckDuckGo for your words.",
  //help: "You can use the keyboard shortcut ctrl + alt + number to open one " +
  //      "of the DuckGo results shown in the preview.",
  preview: function duck_preview(pblock, {object}) {
    var searchTerm = object.text;
    // Don't even display any text before fetching search results,
    // since the results come back nearly instantaneously. In the
    // future, we can display a throbber.
    if (!searchTerm) return void this.previewDefault(pblock);

    //var url = "http://ajax.googleapis.com/ajax/services/search/web";
    var params = {v: "1.0", q: searchTerm, rsz: "small"};

    CmdUtils.previewGet(pblock, url, params, function duck_get(data) {
      var {results} = data.responseData;
      results.forEach(function (r, i) { r.key = i + 1 });

      var noResultsMessage = _(
        "Your search - ${searchTerm} - did not match any documents.",
        {searchTerm: object.html.bold()});
      var tipsMessage = _(
        "Tip: You can go to any result in this preview by pressing " +
        "control, alt, and the result number at the same time.");

      pblock.innerHTML = CmdUtils.renderTemplate(
        feed.dom.getElementById("duck-search").innerHTML,
        { results: results,
          noResultsMessage: noResultsMessage,
          tipsMessage: tipsMessage });
    }, "json");
  }
});