$(function() {
    var entry = $('<li><ul id="h0-0"><button onclick="atlt()">Yo1</button></ul>');
    entry.appendTo($("#h0"));
    var entry = $('<li><ul id="h0-1"><button onclick="atlt()">Yo2</button></ul>');
    entry.appendTo($("#h0"));
    var entry = $('<li><ul id="h0-2"><button id="b">Yo9</button></ul>');
    entry.appendTo($("#h0-1"));
    $("#b").click(function() {
        console.log("clicked");
        addSubElement($('#h0-2'), $('<li>Hi!</li>'));
    });
    var entry = $('<li><ul><p>Yo2</ul></p>');
    entry.insertBefore($("#h0-1"));
    console.log("Done.");
    addToList(entry, $("#h"), [0]);


});

var addSubElement = function(parent, entry) {
    entry.appendTo(parent);
}

var addToList = function(entry, list, indices, delimiter) {
    if (indices !== undefined) {
        delimiter = delimiter || "-";
        indexString = "";
        for (i = 0; i < indices.length - 2; i++) {
            indexString = indexString + indices[i] + delimiter;
        }
        parentIndex = indexString + indices[indices.length - 2];
        indexString = parentIndex + delimiter + indices[indices.length - 1];
        console.log(parentIndex);
        console.log(indexString);
        parentNode = $("#" + list.attr("id") + parentIndex);
        prevNode = $("#" + list.attr("id") + indexString);
        if (prevNode.nextSibling !== undefined) {
            console.log("Adding before");
            entry.insertBefore(prevNode.nextSibling);
        } else {
            console.log("Adding after");
            entry.appendTo(parentNode);
        }
    }
}

var count = 0;
var atlt = function() {
    console.log("YO");
    addToList($('<li><ul><p>' + count + '</ul></p>'), $("#h"), [0, 0, 0]);
    count += 1;
}
