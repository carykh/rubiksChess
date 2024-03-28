function createBoard(n, str){
  var parts = str.split(" ");
  var freq;
  if(parts.length == 1){
    freq = 0.40;
  }else if(parts.length == 2){
    freq = parseFloat(parts[1]);
  }else if(parts.length >= 3){
    freq = -1;
  }

  var PIECE_CHARS = "PNBRQKHS";
  var SIDE_COUNT = 6;
  var board = new Array();
  for(var s = 0; s < SIDE_COUNT; s++){
    board[s] = new Array();
    for(var x = 0; x < n; x++){
      board[s][x] = new Array();
      for(var y = 0; y < n; y++){
        if(freq == -1){
          var ya = y;
          var xa = x;
          if(s != 1){
            ya = (B_N-1-y);
          }
          if(s == 1){
            xa = (B_N-1-x);
          }
          var stringy = arr_index_safe(parts,1+s*B_N+ya);
          var x2 = Math.min(xa,stringy.length-1);
          var ch = stringy.toUpperCase().charAt(x2);
          if(ch == '-'){
            board[s][x][y] = 0;
          }else{
	    var type = PIECE_CHARS.indexOf(ch);
	    var player = 1-Math.floor((stringy.charCodeAt(x2)-65)/32);
	    board[s][x][y] = 1+type+player*PIECE_TYPE_COUNT;
          }
        }else{
	  if(Math.random() < freq){
	    board[s][x][y] = 1+Math.floor(Math.random()*PIECE_TYPE_COUNT*2);
	  }else{
	    board[s][x][y] = 0;
	  }
        }
      }
    }
  }
  return board;
}
function arr_index_safe(arr, n){
	var result = "";
	if(n < arr.length){
		result = arr[n];	
	}
	while(result.length < B_N){
		result += "-";
	}
	return result;
}
function createCube(n){
  var SIDE_COUNT = 6;
  var cube = new Array();
  for(var s = 0; s < SIDE_COUNT; s++){
    cube[s] = new Array();
    for(var x = 0; x < n; x++){
      cube[s][x] = new Array();
      for(var y = 0; y < n; y++){
        if(BOARD_RUBIK){
          cube[s][x][y] = s;
        }else{
          cube[s][x][y] = (x+y)%2;
        }
      }
    }
  }
  return cube;
}
function createRotGrid(n){
  var SIDE_COUNT = 6;
  var rotGrid = new Array();
  for(var s = 0; s < SIDE_COUNT; s++){
    rotGrid[s] = new Array();
    for(var x = 0; x < n; x++){
      rotGrid[s][x] = new Array();
      for(var y = 0; y < n; y++){
        rotGrid[s][x][y] = Math.random()*2*Math.PI;
      }
    }
  }
  return rotGrid;
}
function createValidDest(n){
  var SIDE_COUNT = 6;
  var b = new Array();
  for(var s = 0; s < SIDE_COUNT; s++){
    b[s] = new Array();
    for(var x = 0; x < n; x++){
      b[s][x] = new Array();
      for(var y = 0; y < n; y++){
        b[s][x][y] = [];
      }
    }
  }
  return b;
}
function createVisualBorders(n){
  var SIDE_COUNT = 6;
  var vb = new Array();
  for(var s = 0; s < SIDE_COUNT; s++){
    vb[s] = new Array();
    for(var d = 0; d < 2; d++){
      vb[s][d] = new Array();
      for(var z = 0; z < n+1; z++){
        vb[s][d][z] = [0,0];
      }
    }
  }
  return vb;
}
function translateToSide(c, s){
    c.rotateX(-PI/2);
    if(s == 1){
        c.rotateY(PI);
    }
    if(s >= 2){
        c.rotateX(PI/2);
        c.rotateY((s-2)*PI/2);
    }
}
function calculateScores(){
  scores = new Array(2);
  for(var p = 0; p < 2; p++){
    scores[p] = new Array(PIECE_TYPE_COUNT+1);
    for(var t = 0; t < PIECE_TYPE_COUNT+1; t++){
      scores[p][t] = 0;
    }
  }
  for(var s = 0; s < board.length; s++){
    for(var x = 0; x < B_N; x++){
      for(var y = 0; y < B_N; y++){
        var b = board[s][x][y];
        if(b >= 1){
          var player = Math.floor((b-1)/PIECE_TYPE_COUNT);
          var type = (b-1)%PIECE_TYPE_COUNT;
          scores[player][type] += 1;
          scores[player][PIECE_TYPE_COUNT] += PIECE_SCORES[type];
        }
      }
    }
  }
}
function drawBoard(c, board, sca){
    var time_now = Date.now();
  for(var s = 0; s < 6; s++){
      c.push();
      translateToSide(c,s);
      drawSide(c,board,sca,s,time_now);
      c.pop();
  }
  drawMovingPiece(c, board, sca,time_now);
}

function drawBorders(x,y,sca){
    for(var dire = 0; dire < 2; dire++){
        if(x == dire*(B_N-1)){
            var startY = (y == 0) ? -0.1*sca : 0;
            var endY = (y == B_N-1) ? sca+0.1*sca : sca;
            c.push();
            c.translate(dire*sca,0,-0.1*sca);
            c.fill(0,0,0);
            c.rect(-0.1*sca,startY,0.2*sca,endY-startY);
            c.pop();
        }
        if(y == dire*(B_N-1)){
            var startX = (x == 0) ? -0.1*sca : 0;
            var endX = (x == B_N-1) ? sca+0.1*sca : sca;
            c.push();
            c.translate(0,dire*sca,-0.1*sca);
            c.fill(0,0,0);
            c.rect(startX,-0.1*sca,endX-startX,0.2*sca);
            c.pop();
        }
    }
}

function drawSide(c, board, sca, side, time_now){
  var n = board[0].length;
  c.push();
  c.translate(-n/2*sca,-n/2*sca,-sca*n/2);
  for(var d = 0; d < 2; d++){
    for(var z = 0; z < n+1; z++){
      if(d == 0){
        vb[side][d][z][0] = c.screenPosition(z*sca,0,0);
        vb[side][d][z][1] = c.screenPosition(z*sca,n*sca,0);
      }else if(d == 1){
        vb[side][d][z][0] = c.screenPosition(0,z*sca,0);
        vb[side][d][z][1] = c.screenPosition(n*sca,z*sca,0);
      }
    }
  }
  c.pop();
  var drawSliceMove = shouldDrawSliceMove();
  var sliceInfo;
  var prog;
  if(drawSliceMove){
    var src = lastMoveLocation[0];
    var dst = lastMoveLocation[1];
    sliceInfo = getSliceInfo(src, dst);
    prog = cosInter((time_now-lastMoveTime)/TRANSITION_TIME);
  }

  for(var x = 0; x < n; x++){
    for(var y = 0; y < n; y++){
      var tile = cube[side][x][y];
      c.fill(PLAYER_COLORS[tile][0]);
      c.push();
      if(drawSliceMove){
          getSliceRotation(side, x, y, sliceInfo, c, prog);
      }
      c.translate(-n/2*sca,-n/2*sca,-sca*n/2);
      c.translate(x*sca,y*sca,0);
      c.rect(0.02*sca,0.02*sca,0.96*sca,0.96*sca);

      c.push();
      c.translate(0,0,0.001*sca);
      c.fill(PLAYER_COLORS[tile][1]);
      c.rect(0,0,sca,sca);
      if(!GO_OVER_EDGES){
        drawBorders(x,y,sca);
      }
      c.pop();
      if(isValidOption(side,x,y)){
        drawSmallSquare(c,sca,VALID_COLOR[Math.min(VALID_COLOR.length-1,cube[side][x][y])]);
      }
      if(side == selection[0] && x == selection[1] && y == selection[2]){
        drawSmallSquare(c,sca,SELECTION_COLOR);
      }
      var piece = board[side][x][y];
      if(piece >= 1){
        c.push();
        if(shouldDrawTransition(time_now) && (side == lastMoveLocation[1][0] && x == lastMoveLocation[1][1] && y == lastMoveLocation[1][2])){
            var fac = 1-cosInter((time_now-lastMoveTime)/TRANSITION_TIME);
            if(lastMovePiece >= 1){
                drawPiece(lastMovePiece, sca, fac, rotGrid[side][x][y],0,0);
            }
        }else{
            drawPiece(piece, sca, 1.0, rotGrid[side][x][y],0,0);
        }
        c.pop();
      }
      c.pop();
    }
  }
}
function drawSmallSquare(c,sca,col){
    c.fill(col);
    c.push();
    c.translate(0,0,-0.001*sca);
    c.rect(sca*0.12,sca*0.12,sca*0.76,sca*0.76);
    c.pop();
}
function drawMovingPiece(c, board, sca, time_now){
    if(shouldDrawTransition(time_now)){
        var tile = board[lastMoveLocation[1][0]][lastMoveLocation[1][1]][lastMoveLocation[1][2]];

        var fac = 1-cosInter((time_now-lastMoveTime)/TRANSITION_TIME);
        var step = Math.min(Math.max(Math.floor(fac*travelPath.length),0),travelPath.length-1);

        var step_fac = (fac*travelPath.length)%1.0;
        var startLoc = travelPath[step][0].slice();
        var endLoc = travelPath[step][1].slice();
        var end_OOB = travelPath[step][2].slice();


        if(end_OOB.length >= 3){
            startLoc = end_OOB.slice()
        }
        var s = startLoc[0];
        var x = interp(startLoc[1],endLoc[1],step_fac);
        var y = interp(startLoc[2],endLoc[2],step_fac);

        var sL = travelPath[0][0];
        var eL = travelPath[travelPath.length-1][1];
        var startRot = rotGrid[sL[0]][sL[1]][sL[2]];
        var endRot = rotGrid[eL[0]][eL[1]][eL[2]];

        if(!inBoundsXY(x+0.5,y+0.5)){
        	var pointer = [s,x+0.5,y+0.5];
        	var dire = [0,0];
        	var result = goOverEdge(pointer,dire,0);
        	s = result[0][0];
        	x = result[0][1]-0.5;
        	y = result[0][2]-0.5;

        }

        var rotation = cosInterp(startRot,endRot,fac);
        c.push();
        translateToSide(c,s);
        c.translate(-B_N/2*sca,-B_N/2*sca,-sca*B_N/2);
        c.translate(x*sca,y*sca,0);
        var rotX = 0;
        if(x < 0){
            rotX = -x*Math.PI/2;
        }else if(x >= B_N-1){
            rotX = -(x-(B_N-1))*Math.PI/2;
        }
        var rotY = 0;
        if(y < 0){
            rotY = y*Math.PI/2;
        }else if(y >= B_N-1){
            rotY = (y-(B_N-1))*Math.PI/2;
        }

        drawPiece(tile, sca, 1.0, rotation,rotX,rotY);
        c.pop();
    }
}
function interp(a,b,x){
    return a+(b-a)*x;
}
function cosInterp(a,b,x){
	return a+(b-a)*cosInter(x);
}

function drawPiece(piece, sca, size, rotation, rotX, rotY){
    c.push();
    c.translate(0.5*sca,0.5*sca,0);
    c.scale(17*size);

    c.rotateY(rotX);
    c.rotateX(rotY);
    c.rotateZ(rotation);

    c.rotateX(-0.5*Math.PI);
    var col = PLAYER_COLORS[Math.floor((piece-1)/PIECE_TYPE_COUNT)][2];
    c.fill(col);
    c.model(pieceModels[(piece-1)%PIECE_TYPE_COUNT]);
    c.pop();
}
function shouldDrawTransition(time_now){
    var moveAge = time_now-lastMoveTime;
    if(moveAge < TRANSITION_TIME){
        return (lastMoveType != 3);
    }else{
        return false;
    }
}
function shouldDrawSliceMove(){
    var now = Date.now();
    var moveAge = now-lastMoveTime;
    if(moveAge < TRANSITION_TIME){
        return (lastMoveType == 3);
    }else{
        return false;
    }
}
function cosInter(x){
    return 0.5-0.5*Math.cos(x*Math.PI);
}
function setWorldDrawings(c){
  c.background(100,200,255);
  c.noStroke();

  c.directionalLight(255, 255, 230, -1, 0.7, -1.3);
  c.directionalLight(255, 255, 230, 0.7, 0, -1);
  c.directionalLight(255, 255, 230, 1, 0.7, 1.3);
  c.directionalLight(255, 255, 230, -0.7, -1.3, 1);

  if(pressed){
      rotY += 0.005*(mouseX-prev_mouseX);
      rotX += -0.005*(mouseY-prev_mouseY);
      if(abs(prev_mouseX-mouseX) >= 2 || abs(prev_mouseY-mouseY) >= 2){
          moved = true;
      }
      prev_mouseX = mouseX;
      prev_mouseY = mouseY;
  }
  c.rotateX(rotX);
  c.rotateY(rotY);
}
function invert2x2(m){
  var a = m[0][0];
  var b = m[0][1];
  var c = m[1][0];
  var d = m[1][1];
  var result = new Array();
  for(var i = 0; i < 2; i++){
    result[i] = new Array();
    for(var j = 0; j < 2; j++){
      result[i][j] = 0;
    }
  }
  var det = a*d-b*c;
  if(det < 0){
    return -1;
  }
  result[0][0] = d/det;
  result[1][1] = a/det;
  result[0][1] = -b/det;
  result[1][0] = -c/det;
  return result;
}
function vectorTimes2x2(v2,A){
  if(v2 instanceof p5.Vector) {
    var v = [v2.x,v2.y];
  }else{
    var v = v2;
  }
  return [v[0]*A[0][0]+v[1]*A[1][0],v[0]*A[0][1]+v[1]*A[1][1]];
}
function diff(a, b){
  return [a.x-b.x,a.y-b.y];
}
function pluralize(p, t){
    if(scores[p][t] == 1){
        return scores[p][t]+" "+PIECE_NAMES[t];
    }else{
        return scores[p][t]+" "+PIECE_NAMES[t]+"s";
    }
}
function drawUI(c){
    ui.background(PLAYER_COLORS[turn][0]);
    ui.fill(PLAYER_COLORS[turn][1]);
    ui.textFont('Arial', 24);
    ui.textSize(24);
    
    var x = 12;
    
    var pName = "Any";
    if(TAKE_TURNS){
      pName = PLAYER_NAMES[turn];
    }
    ui.text(pName+"'s turn!",x,40);
    
    for(var p = 0; p < 2; p++){
      ui.text(PLAYER_NAMES[p]+"'s arsenal:",x,100+280*p);
      for(var t = 0; t < PIECE_TYPE_COUNT+1; t++){
      	ui.text(pluralize(p,t),x,100+280*p+(t+1)*24);
      }
    }
    var options = [TAKE_TURNS,GO_OVER_EDGES,TOXIC_ENEMY,BOARD_RUBIK];
    for(var op = 0; op < 4; op++){
    	var str = OPTION_NAMES[op]+" ";
    	if(options[op]){
    	  str += "Yes";
    	}else{
    	  str += "No";
    	}
    	ui.text(str,x,660+op*24);
    }
    if(winner >= 0){
        ui.noStroke();
        ui.fill(255,0,255);
        ui.rect(10,760,240,130);
        ui.fill(PLAYER_COLORS[winner][0]);
        ui.rect(20,770,220,110);
        ui.fill(PLAYER_COLORS[winner][1]);
        var x2 = x+20;
        ui.text(PLAYER_NAMES[winner]+" wins!",x2,800);
        ui.text("But I'll let you keep",x2,825);
        ui.text("going, bc I'm so nice.",x2,850);
    }
    image(ui,-W_W/2+20,-W_H/2+20);
}
function customGameButton(){
  var newGameString = document.getElementById("newGame").value;
  createNewGame(newGameString);
}
function standardGameButton(){
  createNewGame("YYYY hhspp-- hrbbp-- snrqs-- pnqkp-- ppspp-- ------- ------- --PPSHH --PBBRH --SQRNS --PKQNP --PPSPP ------- -------");
}
function sandboxGameButton(){
  createNewGame("NYYY 0.4");
}
function walledGameButton(){
  createNewGame("YNYY hhspp-- hrbbp-- snrqs-- pnqkp-- ppspp-- ------- ------- --PPSHH --PBBRH --SQRNS --PKQNP --PPSPP ------- -------");
}
function createNewGame(str){
  var parts = str.split(" ");
  var options = parts[0].toUpperCase();
  TAKE_TURNS = (options.charAt(0) == 'Y');
  GO_OVER_EDGES = (options.charAt(1) == 'Y');
  TOXIC_ENEMY = (options.charAt(2) == 'Y');
  BOARD_RUBIK = (options.charAt(3) == 'Y');
  
  board = createBoard(B_N, str);
  cube = createCube(B_N);
  rotGrid = createRotGrid(B_N);
  validDest = createValidDest(B_N);
  vb = createVisualBorders(B_N);
  calculateScores();
  turn = 0;
  lastMoveTime = 0;
  winner = -1;
}

function getClickedOn(s,inverse,mX,mY,d){
  var orig = vb[s][0][0][0];
  var mouseB = vectorTimes2x2([mX-orig.x,mY-orig.y],inverse);

  var n = board[0].length;
  for(var z = 0; z < n+1; z++){
    var p1 = vectorTimes2x2(diff(vb[s][d][z][0],orig),inverse);
    var p2 = vectorTimes2x2(diff(vb[s][d][z][1],orig),inverse);
    var e = 1-d;
    var m = (p2[e]-p1[e])/(p2[d]-p1[d]);
    var b = -p1[d]*m+p1[e];
    if(mouseB[e] <= mouseB[d]*m+b){
      return z-1;
    }
  }
  return -1;
}
function drawWireframe(){
  var colors = [[255,0,0],[255,128,0],[255,255,0],[0,255,0],[0,0,255],[128,0,255]];
  for(var s = 0; s < 6; s++){
    strokeWeight(2);
    stroke(colors[s]);
    for(var d = 0; d < 2; d++){
      for(var z = 0; z < 8; z++){
        var x1 = vb[s][d][z][0].x;
        var y1 = vb[s][d][z][0].y;
        var x2 = vb[s][d][z][1].x;
        var y2 = vb[s][d][z][1].y;
        line(x1,y1,x2,y2);
      }
    }
  }
}
function inBounds(point){
    var x = point[1];
    var y = point[2];
    return inBoundsXY(x,y);
}
function inBoundsXY(x,y){
	return (x >= 0 && x < B_N && y >= 0 && y < B_N);
}
function getLastMoveType(dst){
    var v = validDest[dst[0]][dst[1]][dst[2]];
    return v[v.length-1][3];
}
function doMove(src, dst){
    lastMoveLocation[0] = src;
    lastMoveLocation[1] = dst;
    lastMoveTime = Date.now();
    lastMoveType = getLastMoveType(dst);

    if(lastMoveType == 3){
        sliceMove(src,dst);
    }else{
        lastMovePiece = board[dst[0]][dst[1]][dst[2]];
        board[dst[0]][dst[1]][dst[2]] = board[src[0]][src[1]][src[2]];
        board[src[0]][src[1]][src[2]] = 0;
        travelPath = validDest[dst[0]][dst[1]][dst[2]];
    }
    if(TAKE_TURNS){
    	turn = 1-turn;
    }
    clearSelection();
    calculateScores();
    if(winner == -1){
        for(var p = 0; p < 2; p++){
            if(scores[p][5] == 0){
                winner = 1-p;
            }
        }
    }
}
function index_flip(arr){
    var result = new Array(4);
    for(var i = 0; i < 2; i++){
        result[i] = arr[i].slice();
    }
    result[2] = B_N-1-arr[2];
    result[3] = arr[3];
    return result;
}
function invertA(arr){
    var result = new Array(4);
    result[2] = arr[2];
    for(var i = 0; i < 2; i++){
        result[i] = arr[i].slice();
        result[i][1] = arr[i][3];
        result[i][3] = arr[i][1];
    }
    result[3] = -arr[3];
    return result;
}

function getSliceInfo(src, dst){
    var sFace = src[0];
    var eFace = dst[0];

    var M = [[0,2,1,4,3,5],[0,0,2,2],src[1],1];  // the first array are the sides that are cycled, where the first four are the ones we care about, and the last two are the "left and right" sides to be rotated. the second array is the "axis" (row, column, upside-down row, upside-down column) of those sides to be altered, respectively. The third info is the index of the row, and the fourth is the direction of it.
    var M_if = [[0,2,1,4,3,5],[0,0,2,2],B_N-1-src[1],1];
    var S = [[0,3,1,5,4,2],[1,0,1,2],src[2],1];
    var S_alt = [[0,3,1,5,4,2],[1,0,1,2],src[1],1];
    var S_alt_if = [[0,3,1,5,4,2],[1,0,1,2],B_N-1-src[1],1];
    var E = [[2,3,4,5,0,1],[1,1,1,1],src[2],1];

    var sliceInfo = [
        [[], [], M, S, invertA(M), invertA(S)],
        [[], [], invertA(M_if), invertA(S), M_if, S],
        [invertA(M), M, [], E, [], invertA(E)],
        [invertA(S_alt), S_alt, invertA(E), [], E, []],
        [M_if, invertA(M_if), [], invertA(E),  [], E],
        [S_alt_if, invertA(S_alt_if), E, [], invertA(E), []]
        ];
    return sliceInfo[sFace][eFace];
}

function sliceMove(src, dst){
    var sliceInfo = getSliceInfo(src, dst);
    sliceMoveBoth(sliceInfo[0],sliceInfo[1],sliceInfo[2],sliceInfo[3]);
}

function sliceMoveBoth(faces,axes,index,dire){
    sliceMoveInner(board,faces,axes,index);
    sliceMoveInner(cube,faces,axes,index);
    if(index == 0){
    	rotateFace(board, faces[4], dire);
    	rotateFace(cube, faces[4], dire);
    }else if(index == B_N-1){
    	rotateFace(board, faces[5], -dire);
    	rotateFace(cube, faces[5], -dire);
    }
}

function rotateFace(arr, f, dire){
	var newFace = new Array(B_N);
	for(var x = 0; x < B_N; x++){
		newFace[x] = new Array(B_N);
		for(var y = 0; y < B_N; y++){
			if(dire > 0){
				newFace[x][y] = arr[f][y][B_N-1-x];
			}else{
				newFace[x][y] = arr[f][B_N-1-y][x];
			}
		}
	}
	arr[f] = newFace;
}

function sliceMoveInner(arr,faces,axes,index){
    var ph_values = getSlice(arr,faces[3],axes[3],index);
    for(var i = 2; i >= 0; i--){
        var slice_values = getSlice(arr,faces[i],axes[i],index);
        setSlice(arr,faces[i+1],axes[i+1],index,slice_values);
    }
    setSlice(arr,faces[0],axes[0],index,ph_values);
}

function getSlice(arr,face,axis,index){
    var result = new Array(B_N);
    for(var i = 0; i < B_N; i++){
        var j = i;
        var jindex = index;
        if(axis == 1 || axis == 2){
            j = B_N-1-i;
        }
        if(axis == 2 || axis == 3){
            jindex = B_N-1-index;
        }
        if(axis%2 == 0){
            result[i] = arr[face][jindex][j];
        }else{
            result[i] = arr[face][j][jindex];
        }
    }
    return result;
}
function setSlice(arr,face,axis,index,values){
    var result = new Array(B_N);
    for(var i = 0; i < B_N; i++){
        var j = i;
        var jindex = index;
        if(axis == 1 || axis == 2){
            j = B_N-1-i;
        }
        if(axis == 2 || axis == 3){
            jindex = B_N-1-index;
        }
        if(axis%2 == 0){
            arr[face][jindex][j] = values[i];
        }else{
            arr[face][j][jindex] = values[i];
        }
    }
}
function getSliceRotation(s, x, y, sliceInfo, c, prog){
    var rotating = false;
    var axis_choice = 0;
    var faces = sliceInfo[0];
    var index = sliceInfo[2];
    var dire = sliceInfo[3];
    for(var ss = 0; ss < 4; ss++){
        if(faces[ss] == s){
            var axis = sliceInfo[1][ss];
            for(var i = 0; i < B_N; i++){
                var j = i;
                var jindex = index;
                if(axis == 1 || axis == 2){
                    j = B_N-1-i;
                }
                if(axis == 2 || axis == 3){
                    jindex = B_N-1-index;
                }
                if(axis%2 == 0){
                    if(jindex == x && j == y){
                        // WILL ROTATE!
                        rotating = true;
                        axis_choice = axis;
                    }
                }else{
                    if(j == x && jindex == y){
                        // WILL ROTATE!
                        rotating = true;
                        axis_choice = axis;
                    }
                }
            }
        }
    }
    var fac = -PI/2*sliceInfo[3]*(1-prog);
    if(rotating){
        if(mouseX < 100){
        	fac = 0;
        }
        c.rotateZ(axis_choice*PI/2);
        c.rotateX(fac);
        c.rotateZ(-axis_choice*PI/2);
    }
    if(index == 0){
    	if(s == faces[4]){
    	    c.rotateZ(fac);
    	}
    }else if(index == B_N-1){
    	if(s == faces[5]){
    	    c.rotateZ(-fac);
    	}
    }
    return 0;
}

function areSamePoint(a, b){
    return (a[0] == b[0] && a[1] == b[1] && a[2] == b[2]);
}
function clearSelection(){
    selection = [-1,-1,-1];
    validDest = createValidDest(B_N);
}

function splatoonSpread(currLoc, startLoc){
	var dires = [[0,1],[1,0],[0,-1],[-1,0]];
	var s = currLoc[0];
	var x = currLoc[1];
	var y = currLoc[2];
	for(var d = 0; d < dires.length; d++){
		var x_n = x+dires[d][0];
		var y_n = y+dires[d][1];
		var newLoc = [s,x_n,y_n];
		if(inBoundsXY(x_n,y_n) && !areSamePoint(newLoc,startLoc) && cube[s][x][y] == cube[s][x_n][y_n] && validDest[s][x_n][y_n].length == 0){
		    var moveType = (board[s][x_n][y_n] == 0) ? 4 : -1;
		    var validDestChain = validDest[s][x][y].slice();
		    validDestChain.unshift([newLoc.slice(),currLoc.slice(),[],moveType]);
			validDest[s][x_n][y_n] = validDestChain;
		    splatoonSpread(newLoc, startLoc);
		}
	}
}
function isValidOption(side,x,y){
    if(validDest[side][x][y].length >= 1){
        var v = validDest[side][x][y];
        return (v[0][3] >= 0);
    }else{
        return false;
    }
}

function setSelection(s, boardX, boardY){
    if(isValidOption(s,boardX,boardY)){
        var dest = [s,boardX,boardY]
        doMove(selection,dest);
        return;
    }
  var tile = board[s][boardX][boardY];
  var type = (tile-1)%PIECE_TYPE_COUNT;
  var player = Math.floor((tile-1)/PIECE_TYPE_COUNT);
  if(tile == 0 || (TAKE_TURNS && player != turn)){
    clearSelection();
    return;
  }
  selection = [s,boardX,boardY];
  validDest = createValidDest(B_N);
  var dires = [  // HERE ARE THE FIVE FUNDAMENTAL DIRECTION TYPES
      [[0,1],[0,-1],[1,0],[-1,0]],    // orthogonal direction (rook)
      [[1,1],[1,-1],[-1,1],[-1,-1]],    // diagonal direction (bishop)
      [[1,0],[1,0],[1,0],[1,0],
      [-1,0],[-1,0],[-1,0],[-1,0],
      [0,1],[0,1],[0,1],[0,1],
      [0,-1],[0,-1],[0,-1],[0,-1]
      ],   // knight direction (simplified for the weird corner case)
      [[0,B_N],[0,-B_N],[B_N,0],[-B_N,0]], // hand turn (Rubik's slice move)
      [] // splatoon
      ];
  // 1st number is the direction type (index) the piece can do. The second number is whether it can move 
  // 2nd number whether the piece can:
  //     0) move 1 tile into an empty space, only
  //     1) move 1 tile to capture. only
  //     2) move 1 tile into empty or to capture
  //     3) do a slice turn on the puzzle
  //     4) sliding motion, unlimited until it hits a piece
  //     5) knight's path weirdness
  // 3rd number is whether this move can still go over edges if GOE is disabled.
  var piece_dires = [
      [[0,0,0],[1,1,0]], // pawn
      [[2,5,0]], // knight
      [[1,4,0]], // bishop
      [[0,4,0]],  // rook
      [[1,4,0],[0,4,0]], // queen
      [[0,2,0],[1,2,0]], // king
      [[0,2,0],[1,2,0],[3,3,1]], // hand
      [[4,0,0],[0,2,0],[1,2,0]] // splatoon
      ];
    for(var dt = 0; dt < piece_dires[type].length; dt++){
        var dire_type = piece_dires[type][dt][0];
        var dire_power = piece_dires[type][dt][1];
        var dire_goe = piece_dires[type][dt][2];
        if(dire_type == 4){ // splatoon spread
        	if(TOXIC_ENEMY && cube[s][boardX][boardY] == 1-player){
        		// banned because you're on toxic stuff
        	}else{
        		var loc = [s,boardX,boardY];
        		splatoonSpread(loc, loc);
        	}
        }
        for(var d = 0; d < dires[dire_type].length; d++){
            var dire = dires[dire_type][d].slice();
            var pointer = [s,boardX,boardY];
            var prevPointer = [s,boardX,boardY];
            var validDestChain = [];
            var keepGoing = true;
            var steps = 0;
            while(keepGoing){
                if(dire_power == 5){
                    dire = knightDire(dire,d,steps);
                }
                var OOB_pointer = [];
                pointer[1] += dire[0];
                pointer[2] += dire[1];
                if(!inBounds(pointer)){
                    if (GO_OVER_EDGES || dire_goe == 1){
                        OOB_pointer = pointer.slice();
                        var results = goOverEdge(pointer,dire,1);
                        pointer = results[0];
                        dire = results[1];
                        if(!inBounds(pointer)){ // weird corner case
                            keepGoing = false;
                        }
                    }else{
                        keepGoing = false;
                    }
                }
                if(pointer[0] == s && pointer[1] == boardX && pointer[2] == boardY){ // you looped back to where you were.
                    keepGoing = false;
                }
                if(keepGoing){
                    var t = board[pointer[0]][pointer[1]][pointer[2]];
                    var c = cube[pointer[0]][pointer[1]][pointer[2]];
                    var blocked = (t >= 1);
                    var sameTeam = ((t <= PIECE_TYPE_COUNT) == (tile <= PIECE_TYPE_COUNT));

                    var validMove = false;
                    if(TOXIC_ENEMY && type == 5 && c == 1-player){ // the king can't travel onto enemy territory
                    	validMove = false;
                    	keepGoing = false;
                    }else if(dire_power == 0){
                        if(!blocked){
                            validMove = true;
                        }
                        keepGoing = false;
                    }else if(dire_power == 1){
                        if(blocked && !sameTeam){
                            validMove = true;
                        }
                        keepGoing = false;
                    }else if(dire_power == 2 || dire_power == 3){
                        if(!blocked || !sameTeam || dire_power == 3){
                            validMove = true;
                        }
                        keepGoing = false;
                    }else if(dire_power == 4){
                        if(blocked){
                            validMove = (!sameTeam);
                            keepGoing = false;
                        }else if(TOXIC_ENEMY && c == 1-player){
                            keepGoing = false;
                            validMove = true;
                        }else{
                            validMove = true;
                        }
                    }else if(dire_power == 5){ // knight weirdness
                        if(steps < 2){
                            validMove = false;
                            keepGoing = true;
                        }else{
                            validMove = (!blocked || !sameTeam);
                            keepGoing = false;
                        }
                    }
                    if(validMove || keepGoing){
                        validDestChain.unshift([pointer.slice(),prevPointer.slice(),OOB_pointer.slice(),dire_power]);
                    }
                    if(validMove){
                        validDest[pointer[0]][pointer[1]][pointer[2]] = validDestChain.slice();
                    }
                    prevPointer = pointer.slice();
                }
                steps++;
            }
        }
    }
}
function knightDire(dire,d,steps){
    var startDist = 1+d%2;
    if(steps == startDist){ // the knight should turn
        var turnDire = -1+2*(Math.floor(d/2)%2);
        if(dire[0] == 0){
            return [turnDire,0];
        }else{
            return [0,turnDire];
        }
    }else{ // the knight should not turn
        return dire;
    }
}
function goOverEdge(pointer,dire,m){
    var s = pointer[0];
    var x = pointer[1];
    var y = pointer[2];
    if(s == 0){
        if(y >= B_N){
            return [[2,x,y-B_N],[dire[0],dire[1]]];
        }else if(y < 0){
            return [[4,B_N-m-x,-m-y],[-dire[0],-dire[1]]];
        }
        if(x >= B_N){
            return [[5,B_N-m-y,x-B_N],[-dire[1],dire[0]]];
        }else if(x < 0){
            return [[3,y,-m-x],[dire[1],-dire[0]]];
        }
    }else if(s == 1){
        if(y >= B_N){
            return [[2,B_N-m-x,B_N*2-m-y],[-dire[0],-dire[1]]];
        }else if(y < 0){
            return [[4,x,B_N+y],[dire[0],dire[1]]];
        }
        if(x >= B_N){
            return [[3,y,B_N*2-m-x],[dire[1],-dire[0]]];
        }else if(x < 0){
            return [[5,B_N-m-y,B_N+x],[-dire[1],dire[0]]];
        }
    }else{
        if(x >= B_N){
            return [[((s-2)+3)%4+2,x-B_N,y],[dire[0],dire[1]]];
        }else if(x < 0){
            return [[((s-2)+1)%4+2,x+B_N,y],[dire[0],dire[1]]];
        }
        if(s == 2){
            if(y >= B_N){
                return [[1,B_N-m-x,B_N*2-m-y],[-dire[0],-dire[1]]];
            }else if(y < 0){
                return [[0,x,B_N+y],[dire[0],dire[1]]];
            }
        }else if(s == 3){
            if(y >= B_N){
                return [[1,B_N*2-m-y,x],[-dire[1],dire[0]]];
            }else if(y < 0){
                return [[0,-m-y,x],[-dire[1],dire[0]]];
            }
        }else if(s == 4){
            if(y >= B_N){
                return [[1,x,y-B_N],[dire[0],dire[1]]];
            }else if(y < 0){
                return [[0,B_N-m-x,-m-y],[-dire[0],-dire[1]]];
            }
        }else if(s == 5){
            if(y >= B_N){
                return [[1,y-B_N,B_N-m-x],[dire[1],-dire[0]]];
            }else if(y < 0){
                return [[0,y+B_N,B_N-m-x],[dire[1],-dire[0]]];
            }
        }
    }
    return [pointer,dire];
}
function detectChessSquareClick(mX,mY){
  var hitSomething = false;
  for(var s = 0; s < 6; s++){
    var matrix = [diff(vb[s][0][0][1],vb[s][0][0][0]),diff(vb[s][1][0][1],vb[s][0][0][0])];
    var inverse = invert2x2(matrix);
    if(inverse == -1){
      //back side face
    }else{
      var boardX = getClickedOn(s,inverse,mX,mY,0);
      var boardY = getClickedOn(s,inverse,mX,mY,1);
      if(boardX >= 0 && boardY >= 0){
        setSelection(s,boardX,boardY);
        hitSomething = true;
      }
    }
  }
  if(!hitSomething){
    validDest = createValidDest(B_N);
    clearSelection();
  }
}
function spinCamera(){
    if(cameraSpin){
        var diff = Date.now()-lastCameraTime;
        rotY += diff*0.00003;
        lastCameraTime = Date.now();
    }
}

var TAKE_TURNS = true;
var GO_OVER_EDGES = false;
var TOXIC_ENEMY = false;
var BOARD_RUBIK = true; // 0 = rubiks cube, 1 = chessboard

var OPTION_NAMES = ["Take turns?","Go over edges?","Enemy color mud?","Rubik's colors?"];

var TRANSITION_TIME = 1200; // milliseconds
var PIECE_SCORES = [1,3,3,5,9,20,5,4];
var PIECE_NAMES = ["pawn","knight","bishop","rook","queen","king","hand","splatoon","point"];

var turn = 0;
var W_W = 1920;
var W_H = 1080;
var B_N = 7;
var PIECE_TYPE_COUNT = 8;
var PLAYER_COLORS = [
[[255,255,255],[0,0,0],[255,235,241]],
[[0,0,0],[255,255,255],[90,90,90]],
[[0,40,255],[0,0,0],[0,40,255]],
[[255,140,0],[0,0,0],[255,140,0]],
[[0,180,0],[0,0,0],[0,180,0]],
[[255,0,0],[0,0,0],[255,0,0]]];
var PLAYER_NAMES = ["White","Black","Blue","Orange","Green","Red"];
var SELECTION_COLOR = [128,255,128];
var VALID_COLOR = [[220,170,0],[255,255,0]];
var board;
var cube;
var rotGrid;
var validDest;
var vb;

var pieceModels = new Array();
var playerTurn = 0;
var selection = [-1,-1,-1];

var rotX = 0;
var rotY = 0;
var prev_mouseX = 0;
var prev_mouseY = 0;
var moved = false;
var pressed = false;
var lastMoveLocation = [[-1,-1,-1],[-1,-1,-1]];
var lastMoveTime = 0;
var lastMovePiece = 0;
var lastMoveType = 0;
var travelPath = [];
var scores = [];
var winner = -1;
var cameraSpin = false;
var lastCameraTime = -1;
var ui;
for(var p = 0; p < PIECE_TYPE_COUNT; p++){
  let m;
  pieceModels[p] = m;
}
let c;

function preload(){
  for(var p = 0; p < PIECE_TYPE_COUNT; p++){
    pieceModels[p] = loadModel("models/piece"+p+".obj");
  }
}
function setup() {
  createCanvas(W_W, W_H, WEBGL);
  c = createGraphics(W_W, W_H, WEBGL);
  addScreenPositionFunction(c);
  sandboxGameButton();
  ui = createGraphics(260,900);
};

function draw() {
  spinCamera();
  c.push();
  setWorldDrawings(c);
  drawBoard(c, board, 80);
  c.pop();

  background(255,255,255);
  image(c,-W_W/2,-W_H/2);
  //drawWireframe();
  drawUI();
}
function mousePressed(){
  pressed = true;
  moved = false;
  prev_mouseX = mouseX;
  prev_mouseY = mouseY;

}
function keyPressed(){
  if (keyCode == SHIFT) {
    cameraSpin = !cameraSpin;
    if(cameraSpin){
        lastCameraTime = Date.now();
    }
  }
}
function mouseReleased(){
    if(!moved){
        var mY = mouseY-W_H/2;
        var mX = mouseX-W_W/2;
        detectChessSquareClick(mX,mY);
    }
    pressed = false;
}
