var nestedLinkedList = function(head) {
    this.head = [head, undefined];
    this.tail = this.head;
    this.next = this.head;
    this.size = 1;
    this.numTabs = 0;
}

nestedLinkedList.prototype.append = function(datum) {
    this.tail[1] = [datum, undefined];
    this.tail = this.tail[1];
    this.size += 1;
    console.log(this.tail);
}

nestedLinkedList.prototype.push = function(datum) {
    this.head = [datum, this.head];
    this.size += 1;
}

nestedLinkedList.prototype.pop = function() {
    var datum = this.head[0];
    this.head = undefined;
    this.size -= 1;
    return datum;
}

nestedLinkedList.prototype.get = function(index) {
    if (index === 0) {
        return this.head[0];
    } else if (index === this.size - 1) {
        return this.tail[0];
    } else {
        cur = this.head;
        for (var i = 0; i < index; i++) {
            cur = cur[1];
        }
        return cur[0];
    }
}

nestedLinkedList.prototype.insert = function(datum, index) {
    if (index === 0) {
        this.push(datum);
    } else if (index === this.size) {
        this.append(datum);
    } else if (index.length === undefined || index.length === 1) {
        var cur = this.head;
        for (var i = 0; i < index - 1; i++) {
            cur = cur[1];
        }
        cur[1] = [datum, cur[1]];
        this.size += 1;
    } else {
        var curList = this;
        while (index.length > 1) {
            curList = curList.get(index[0], true);
            index = index.slice(1);
        }
        curList.insert(datum, index[0]);
    }
}

nestedLinkedList.prototype.forEach = function(fn) {
    var next = this.head;
    while (next[1] !== undefined) {
        fn(next[0]);
        next = next[1];
    }
    fn(next[0]);
}

nestedLinkedList.prototype.toString = function(base, spaces) {
    result = "";
    spaces = spaces || "\n";
    this.forEach(function(item) {
        result = result + spaces + item.toString(base, spaces + "  : ");
    });
    return result;
}

/*
list = new nestedLinkedList(10);
for (i = 2; i < 4; i++) {
    list.push(new nestedLinkedList(i));
}
list.push(new nestedLinkedList(28));
var f = new nestedLinkedList(100000000000);
var g = new nestedLinkedList(200000000000);
f.append(g);
g.append(new nestedLinkedList(300000000000));
list.append(f);
for (var i = 0; i < 7; i++) {
    list.push(i);
}
list.append(1000);

alert(list);

list = new nestedLinkedList(1);
list.push(new nestedLinkedList(2));

list.insert(100, [0, 1]);

alert(list);
*/
