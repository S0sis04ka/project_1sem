window.addEventListener('load', main, false);

var which_algo = 0; //0 - bfs

function manhattan(a, b, x, y) {
	return Math.abs(x - a) + Math.abs(y - b);
}

function handleChange1() {
	which_algo = 0;
}

function handleChange2() {
	which_algo = 1;
}

function compare(a, b) {
	if (a.euristic < b.euristic) {
		return -1;
	}

	if (a.euristic > b.euristic) {
		return 1;
	}

	return 0;
}

function AStar(s, dest) {
	var was = new Array(n, false);
	var d = new Array(n, null);
	var p = new Array(n, null);
	var queue = [];
	s.euristic = manhattan(dest.x, dest.y, s.x, s.y);
	queue.push(s);
	was[s.number] = true;
	d[s.number] = 0;
	p[s.number] = -1;

	while (queue.length != 0) {
		queue.sort(compare);
		var v = queue.shift();
		v.colorYellow();

		if (v.number == dest.number) {
			break;
		}

		for (var i = 0; i < v.kids; i++) {
			var to = v.neighboors[i];
			if (was[to.number] == false) {
				was[to.number] = true;
				queue.push(to);
				d[to.number] = d[v.number] + 1;
				p[to.number] = v.number;
			}
		}
	}

	// восстановление

	var path = [];

	console.log(was);
	console.log(p);

	if (was[dest.number] == false) {
		alert('NO PATH');
		console.log("No path");
	}

	else {
		for (var v = dest; p[v.number] != -1; v = graph[p[v.number]]) {
			path.push(v);
		}

		path.push(s);
		path.reverse();

		for (var i = 0; i < path.length; i++) {
			path[i].colorRed();
		}
	}
}

function main(){
	console.log('connected');

	var ctx = canvas_example.getContext('2d');
	var h = canvas_example.height;
	var w = canvas_example.width;

	dx = 50;
	dy = 50;

	x = w/dx;
	y = h/dy;

	n = x * y;

	console.log(h, w);

	function Array(n, obj) {
		var A = [];

		for (var i = 0; i < n; i++) {
			A.push(obj);
		}

		return A;
	}

	function Node(x_cur, y_cur){
		this.x = x_cur; 
		this.y = y_cur;
		this.number = x_cur/dx * y + y_cur/dy;
		this.neighboors = [];
		this.kids = 0;
		this.threshold = 0;
		this.euristic = -1;
		var that = this;

		this.draw = function() {
			ctx.font = "20px serif";
			ctx.fillStyle = 'white';
			ctx.fillRect(x_cur, y_cur, dx, dy);
			ctx.strokeRect(x_cur, y_cur, dx, dy);

			//ctx.fillText(that.number, x_cur, y_cur + 20);
		}


		this.colorRed = function() {
			ctx.fillStyle = "red";
			ctx.fillRect(x_cur, y_cur, dx, dy);
			ctx.strokeRect(x_cur, y_cur, dx, dy);
		}

		this.colorBlue = function() {
			ctx.fillStyle = "blue";
			ctx.fillRect(x_cur, y_cur, dx, dy);
			ctx.strokeRect(x_cur, y_cur, dx, dy);
		}

		this.colorYellow = function() {
			ctx.fillStyle = "yellow";
			ctx.fillRect(x_cur, y_cur, dx, dy);
			ctx.strokeRect(x_cur, y_cur, dx, dy);
		}

		this.colorGreen = function() {
			ctx.fillStyle = "green";
			ctx.fillRect(x_cur, y_cur, dx, dy);
			ctx.strokeRect(x_cur, y_cur, dx, dy);
		}

	}

	var graph = [];

	// создание графа

	for (var i = 0; i < x; i++) {
		for (var j = 0; j < y; j++) {
			var tmp = new Node(i*dx, j*dy);
			graph.push(tmp);
		}
	}

	function obsticles(k) {
		for (var i = 0; i < k*n; i++) {
			graph[Math.floor(Math.random()*n)].threshold = 1;
		}
	}

	// номер вершины - graph.x/dx * y + graph.y/dy

	// console.log(graph[78].number);

	// добавление соседей

	obsticles(0.30);


	for (var i = 0; i < n; i++) {

		if (i == 0) {
			graph[i+y].threshold == 0 ? graph[i].neighboors.push(graph[i+y]) : graph[i].kids--; 
			graph[i+1].threshold == 0 ? graph[i].neighboors.push(graph[i+1]) : graph[i].kids--;
			graph[i].kids += 2;

		}

		if (i == y-1) {
			graph[i-1].threshold == 0 ? graph[i].neighboors.push(graph[i-1]) : graph[i].kids--;
			graph[i+y].threshold == 0 ? graph[i].neighboors.push(graph[i+y]) : graph[i].kids--;
			graph[i].kids += 2;
		}

		if (i == n-1) {
			graph[i-1].threshold == 0 ? graph[i].neighboors.push(graph[i-1]) : graph[i].kids--;
			graph[i-y].threshold == 0 ? graph[i].neighboors.push(graph[i-y]) : graph[i].kids--;
			graph[i].kids += 2;
		}

		if (i == n-y) {
			graph[i+1].threshold == 0 ? graph[i].neighboors.push(graph[i+1]) : graph[i].kids--;
			graph[i-y].threshold == 0 ? graph[i].neighboors.push(graph[i-y]) : graph[i].kids--;
			graph[i].kids += 2;
		}

		else if ((i % y == y-1) && (i != 0) && (i != y-1) && (i != n-1) && (i != n-y)) {
			graph[i-y].threshold == 0 ? graph[i].neighboors.push(graph[i-y]) : graph[i].kids--;
			graph[i+y].threshold == 0 ? graph[i].neighboors.push(graph[i+y]) : graph[i].kids--;
			graph[i-1].threshold == 0 ? graph[i].neighboors.push(graph[i-1]) : graph[i].kids--;
			graph[i].kids += 3;
		}

		else if ((i % y == 0) && (i != 0) && (i != y-1) && (i != n-1) && (i != n-y)) {
			graph[i-y].threshold == 0 ? graph[i].neighboors.push(graph[i-y]) : graph[i].kids--;
			graph[i+y].threshold == 0 ? graph[i].neighboors.push(graph[i+y]) : graph[i].kids--;
			graph[i+1].threshold == 0 ? graph[i].neighboors.push(graph[i+1]) : graph[i].kids--;
			graph[i].kids += 3;
		}

		else if ((i > 0) && (i < y) && (i != 0) && (i != y-1) && (i != n-1) && (i != n-y)) {
			graph[i+1].threshold == 0 ? graph[i].neighboors.push(graph[i+1]) : graph[i].kids--;
			graph[i+y].threshold == 0 ? graph[i].neighboors.push(graph[i+y]) : graph[i].kids--;
			graph[i-1].threshold == 0 ? graph[i].neighboors.push(graph[i-1]) : graph[i].kids--;
			graph[i].kids += 3;
		}

		else if ((i > n-y) && (i < n) && (i != 0) && (i != y-1) && (i != n-1) && (i != n-y)) {
			graph[i+1].threshold == 0 ? graph[i].neighboors.push(graph[i+1]) : graph[i].kids--;
			graph[i-y].threshold == 0 ? graph[i].neighboors.push(graph[i-y]) : graph[i].kids--;
			graph[i-1].threshold == 0 ? graph[i].neighboors.push(graph[i-1]) : graph[i].kids--;
			graph[i].kids += 3;
		}

		else if ((i != 0 || i != y-1 || i != x*y-1 || i != n-y) && (i != 0) && (i != y-1) && (i != n-1) && (i != n-y)) {
			graph[i+y].threshold == 0 ? graph[i].neighboors.push(graph[i+y]) : graph[i].kids--;
			graph[i-y].threshold == 0 ? graph[i].neighboors.push(graph[i-y]) : graph[i].kids--;
			graph[i+1].threshold == 0 ? graph[i].neighboors.push(graph[i+1]) : graph[i].kids--;
			graph[i-1].threshold == 0 ? graph[i].neighboors.push(graph[i-1]) : graph[i].kids--;
			graph[i].kids += 4;
		}
	}

	for (var i = 0; i < n; i++) {
		graph[i].draw();
		if (graph[i].threshold == 1) {
			graph[i].colorBlue();
		}
	}

	console.log(graph);

	function bfs(s, dest) {
		var was = new Array(n, false);
		var d = new Array(n, null);
		var p = new Array(n, null);
		var queue = [];
		queue.push(s);
		was[s.number] = true;
		d[s.number] = 0;
		p[s.number] = -1;

		while (queue.length != 0) {
			var v = queue.shift();
			v.colorYellow();

			if (v.number == dest.number) {
				break;
			}

			for (var i = 0; i < v.kids; i++) {
				var to = v.neighboors[i];
				if (was[to.number] == false) {
					was[to.number] = true;
					queue.push(to);
					d[to.number] = d[v.number] + 1;
					p[to.number] = v.number;
				}
			}
		}

		// восстановление

		var path = [];

		console.log(was);
		console.log(p);

		if (was[dest.number] == false) {
			alert('NO PATH');
			console.log("No path");
		}

		else {
			for (var v = dest; p[v.number] != -1; v = graph[p[v.number]]) {
				path.push(v);
			}

			path.push(s);
			path.reverse();

			for (var i = 0; i < path.length; i++) {
				path[i].colorRed();
			}
		}

	}

	function AStar(s, dest) {
		var was = new Array(n, false);
		var d = new Array(n, null);
		var p = new Array(n, null);
		var queue = [];
		s.euristic = manhattan(dest.x, dest.y, s.x, s.y);
		queue.push(s);
		was[s.number] = true;
		d[s.number] = 0;
		p[s.number] = -1;

		while (queue.length != 0) {
			queue.sort(compare);
			var v = queue.shift();
			v.colorYellow();

			if (v.number == dest.number) {
				break;
			}

			for (var i = 0; i < v.kids; i++) {
				var to = v.neighboors[i];
				if (was[to.number] == false) {
					was[to.number] = true;
					to.euristic = manhattan(dest.x, dest.y, to.x, to.y)
					queue.push(to);
					d[to.number] = d[v.number] + 1;
					p[to.number] = v.number;
				}
			}
		}

		// восстановление

		var path = [];

		console.log(was);
		console.log(p);

		if (was[dest.number] == false) {
			alert('NO PATH');
			console.log("No path");
		}

		else {
			for (var v = dest; p[v.number] != -1; v = graph[p[v.number]]) {
				path.push(v);
			}

			path.push(s);
			path.reverse();

			for (var i = 0; i < path.length; i++) {
				path[i].colorRed();
			}
		}
	}


	function get_mouse_coords(e){
		var m = {};
		var rect = canvas_example.getBoundingClientRect();
		m.x = e.clientX - rect.left;
		m.y = e.clientY - rect.top;
		// console.log(m);
		return m;
	}

	var ifStart = 0;

	var start, finnish;

	canvas_example.onclick = function(e) {
		if (ifStart == 0) {
			clean();
			m = get_mouse_coords(e);
			console.log(Math.floor(m.x/dx) * y + Math.floor(m.y/dy));

			if (graph[Math.floor(m.x/dx) * y + Math.floor(m.y/dy)].threshold == 1) {
				alert('ThIS IS A WALL');
				return;
			}

			start = Math.floor(m.x/dx) * y + Math.floor(m.y/dy);
			graph[start].colorGreen();
			ifStart = 1;
		}

		else {
			m = get_mouse_coords(e);

			if (graph[Math.floor(m.x/dx) * y + Math.floor(m.y/dy)].threshold == 1) {
				alert('ThIS IS A WALL');
				return;
			}

			finnish = Math.floor(m.x/dx) * y + Math.floor(m.y/dy);
			graph[finnish].colorGreen();

			if (which_algo == 1) {
				AStar(graph[start], graph[finnish]);
			}
			if (which_algo == 0) {
				bfs(graph[start], graph[finnish]);
			}

			ifStart = 0;
		}


	}

	function clean() {
		for (var i = 0; i < n; i++) {
			if (graph[i].threshold != 1) {
				graph[i].draw();
			}
		}
	}


	console.log(n);


	//setInterval(bfs(graph[0], graph[319]), 200);


}
