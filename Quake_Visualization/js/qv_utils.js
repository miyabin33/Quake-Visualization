function display_resize(gl, id){
    var dpr = 1.0;
    var c = document.getElementById(id);
    c.width = window.innerWidth * dpr;
    c.height = window.innerHeight * dpr;
    gl.viewport(0.0, 0.0, c.width, c.height);
}

function create_framebuffer(gl, width, height){
    var frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    var depthRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
    var fTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return {f : frameBuffer, d : depthRenderBuffer, t : fTexture};
}

function japan(file){
    var coord = new Array(), alpha = new Array();
    var xhr = new XMLHttpRequest();
    xhr.open("get", file, false);
    xhr.send(null);
    var alpha_flag = false;

    var tmpArray = xhr.responseText.split("\n");
    for(var i = 0; i < tmpArray.length; i++){
        var word = ' @' + tmpArray[i];
        if(word.indexOf(' @' + '#') !=-1){
            console.log("japan program started.");
        }else if(word.indexOf(' @' + '>') !=-1){
            if(coord.length === 0){
                continue;
            }else{
                coord.push(coord[coord.length - 1], coord[coord.length]);
                alpha.push(0.0);
                alpha_flag = true;
            }
        }else if(i + 1 === tmpArray.length){
            console.log("japan program finished.");
        }else{
            var vertex = tmpArray[i].split(String.fromCharCode(9));
            if(alpha_flag = true){
                coord.push(vertex[0], vertex[1]);
                alpha.push(0.0);
                alpha_flag = false;
            }
            coord.push(vertex[0], vertex[1]);
            alpha.push(1.0);
        }
    }

    var pos = new Array(), col = new Array(), ani = new Array();

    var cnt = 0;
    for(var i = 0; i < coord.length; i += 2){
        pos.push(coord[i], coord[i + 1], 0.0);
        ani.push(0.1);
        col.push(1.0, 1.0, 1.0, alpha[cnt]);
        cnt++
    }

    return {p : pos, c : col, a : ani};
}

function quake(today){
    //var file = 'data/h201610';
    var file = 'data/h2011';
    var pos = new Array(), col = new Array(), dep = new Array();
    var year, month, day, date, verX, verXX, verY, verYY, depth, depthDep, mag, sint;
    var mFlag = true, sFlag = false;
    var xhr = new XMLHttpRequest();
    xhr.open("get", file, false);
    xhr.send(null);

    var tmpArray = xhr.responseText.split("\n");
    for(var i = 0; i < tmpArray.length; i++){
        year = tmpArray[i].substr(1, 4);
        month = tmpArray[i].substr(5, 2);
        day = tmpArray[i].substr(7, 2);
        date = year + "-" + month + "-" + day;
        verX = tmpArray[i].substr(21, 7);
        verXX = tmpArray[i].substr(28, 4);
        verY = tmpArray[i].substr(32, 8);
        verYY = tmpArray[i].substr(40, 4);
        depth = tmpArray[i].substr(44, 5);
        depthDep = tmpArray[i].substr(49, 3);
        mag = parseFloat(tmpArray[i].substr(52, 2) * 0.1);
        sint = tmpArray[i].substr(61, 1);

        if(date == today && mFlag == true){
            if(mag >= 3.0 && mag < 4.0){
                col.push(0.0, 0.0, 1.0, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(mag >= 4.0 && mag < 5.0){
                col.push(1.0, 0.8, 0.6, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(mag >= 5.0 && mag < 6.0){
                col.push(1.0, 1.0, 0.0, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(mag >= 6.0 && mag < 7.0){
                col.push(1.0, 0.5, 0.0, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(mag >= 7.0 && mag < 8.0){
                col.push(1.0, 0.0, 0.0, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(mag >= 8.0 && mag < 9.0){
                col.push(0.5, 0.0, 0.1, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(mag >= 9.0){
                col.push(0.5, 0.0, 0.5, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
        }
        else if(date == today && sFlag == true){
            if(sint == 3){
                col.push(0.0, 0.0, 1.0, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(sint == 4){
                col.push(1.0, 0.8, 0.6, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(sint == "A"){
                col.push(1.0, 1.0, 0.0, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(sint == "B"){
                col.push(1.0, 0.5, 0.0, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(sint == "C"){
                col.push(1.0, 0.0, 0.0, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(sint == "D"){
                col.push(0.5, 0.0, 0.1, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
            else if(sint == 7){
                col.push(0.5, 0.0, 0.5, 1.0);
                pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep);
            }
        }
    }

    return {p : pos, c : col, d : dep};
}

function pushdata(pos, dep, verX, verXX, verY, verYY, depth, depthDep){
    pos.push(parseFloat(verY * 0.0001 + 2 * verYY * 0.01), parseFloat(verX * 0.0001 + 2 * verXX * 0.01), 0.001);
    dep.push(parseFloat(depth * 0.01 + 2 * depthDep * 0.01));
}

















