onload = function(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear() - 1;

    if(month < 10) month = "0" + month;
    if(month == 0){
        month = "12";
        year = year - 1;
    }
    if(day < 10) day = "0" + day;

    //var today = year + "-" + month + "-" + day;
    var today = "2011-03-11";
    document.getElementById("today").value = today;
    
    var JaLine = japan('gmt/japan.gmt');
    var QuData = quake(today);
    
    var c = document.getElementById('canvas');
    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if(!gl) alert("It failed making gl.");
    
    display_resize(gl, 'canvas');
    
    //CameraWork
    var default_camPosition = [139.766667, 35.681111, 30.0];
    var default_camLookAt = [139.766667, 35.681111, 0.0];
    var defaultcamUp = [0.0, 1.0, 0.0];
    var camPosition = default_camPosition;
    var camLookAt = default_camLookAt;
    var camUp = defaultcamUp;
    
    var m = new matIV();
    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var tmpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());
    var invMatrix = m.identity(m.create());
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
    
    var main_vs = create_shader(gl, 'main_vs');
    var main_fs = create_shader(gl, 'main_fs');
    var main_prg = create_program(gl, main_vs, main_fs);
    var main_attL = new Array();
    main_attL[0] = gl.getAttribLocation(main_prg, 'position');
    main_attL[1] = gl.getAttribLocation(main_prg, 'color');
    main_attL[2] = gl.getAttribLocation(main_prg, 'flag');
    var main_attS = [3, 4, 1];
    var main_uniL = new Array();
    main_uniL[0] = gl.getUniformLocation(main_prg, 'mvpMatrix');
    
    var point_vs = create_shader(gl, 'point_vs');
    var point_fs = create_shader(gl, 'point_fs');
    var point_prg = create_program(gl, point_vs, point_fs);
    var point_attL = new Array();
    point_attL[0] = gl.getAttribLocation(point_prg, 'position');
    point_attL[1] = gl.getAttribLocation(point_prg, 'color');
    var point_attS = [3, 4];
    var point_uniL = new Array();
    point_uniL[0] = gl.getUniformLocation(point_prg, 'mvpMatrix');
    point_uniL[1] = gl.getUniformLocation(point_prg, 'pointSize');
    
//Japan Line
    var JLPos = create_vbo(gl, JaLine.p);
    var JLCol = create_vbo(gl, JaLine.c);
    var JLAni = create_vbo(gl, JaLine.a);
    var JLVBOList = [JLPos, JLCol, JLAni];
    
//Quake Point
    var QuPos = create_vbo(gl, QuData.p);
    var QuCol = create_vbo(gl, QuData.c);
    var QuVBOList = [QuPos, QuCol];
    
    function update_framebuffer(){
        if(c.width <= 512 || c.height <= 512){
            bufferWidth = 512;
            bufferHeight = 512;
            fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
        }else if((c.width > 512 || c.height > 512) && (c.width <= 1024 || c.height <= 1024)){
            bufferWidth = 1024;
            bufferHeight = 1024;
            fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
        }else if((c.width > 1024 || c.height > 1024) && (c.width <= 2048 || c.height <= 2048)){
            bufferWidth = 2048;
            bufferHeight = 2048;
            fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
        }else if((c.width > 2048 || c.height > 2048) && (c.width <= 4096 || c.height <= 4096)){
            bufferWidth = 4096;
            bufferHeight = 4096;
            fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
        }else if((c.width > 4096 || c.height > 4096) && (c.width <= 8192 || c.height <= 8192)){
            bufferWidth = 8192;
            bufferHeight = 8192;
            fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
        }else if((c.width > 8192 || c.height > 8192) && (c.width <= 16384 || c.height <= 16384)){
            bufferWidth = 16384;
            bufferHeight = 16384;
            fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
            gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
        }
    }
    
    window.onresize = function(){
        display_resize(gl, 'canvas');
        update_framebuffer();
    };
    
    var drag = false;
    var m_stX = 0, m_stY = 0;
    
    document.addEventListener('mousedown' || 'touchstart', function(e){
        e.preventDefault();
        drag = true;
        m_stX = e.clientX;
        m_stY = e.clientY;
    }, true);
    
    document.addEventListener('mousemove' || 'touchend', function(e){
        if(drag){
            var safety = camPosition[2] / 15.0;
            var ratio = 0.0005;
            
            camPosition[0] = camLookAt[0] - ((-m_stX + e.clientX) * safety) * ratio;
            camPosition[1] = camLookAt[1] + ((-m_stY + e.clientY) * safety) * ratio;
            
            camLookAt[0] = camPosition[0];
            camLookAt[1] = camPosition[1];
        }
    }, true);
    
    document.addEventListener('mouseup' || 'touchmove', function(e){
        drag = false;
    }, true);
    
    document.addEventListener('wheel', function(e){
        var del = 1.025;
        if (e.shiftKey) del = 1.01;
        var ds = ((e.deltaY || e.wheelDelta) > 0) ? del : (1 / del);
        camPosition[2] /= ds;
    }, true);
    
    (function(){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        m.lookAt(camPosition, camLookAt, camUp, vMatrix);
        m.perspective(45.0, c.width / c.height, 0.001, 1000.0, pMatrix);
        m.multiply(pMatrix, vMatrix, tmpMatrix);
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);
        m.inverse(mMatrix, invMatrix);
        
        gl.useProgram(main_prg);
        set_attribute(gl, JLVBOList, main_attL, main_attS);
        gl.uniformMatrix4fv(main_uniL[0], false, mvpMatrix);
        gl.drawArrays(gl.LINE_STRIP, 0, JaLine.p.length / 3);
        
        if(today != document.getElementById("today").value){
            QuData = quake(document.getElementById("today").value);
            today = document.getElementById("today").value;
            
            QuPos = create_vbo(gl, QuData.p);
            QuCol = create_vbo(gl, QuData.c);
            QuVBOList = [QuPos, QuCol];
        }
        
        gl.useProgram(point_prg);
        set_attribute(gl, QuVBOList, point_attL, point_attS);
        gl.uniformMatrix4fv(point_uniL[0], false, mvpMatrix);
        gl.uniform1f(point_uniL[1], 10.0);
        gl.drawArrays(gl.POINTS, 0, QuData.p.length/ 3);
        
        gl.flush();
		requestAnimationFrame(arguments.callee);
        
    })();
};

















