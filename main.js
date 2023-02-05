KeyFunctions.AddNewSpace();
KeyFunctions.UpdatePropositions([]);
for(let i=0;i<KeyShortcuts.length;i++){
    KeyShortcuts[i].__triggered__=false;
};
let pressedKeys = [];

$(document.body).keydown(function (evt) {
    pressedKeys[evt.code]=true;
    for(let i=0;i<KeyShortcuts.length;i++){
        if(!KeyShortcuts[i].__triggered__){
            let rst = true;
            KeyShortcuts[i].forEach(key=>{
                if(key.Key){
                    if(!pressedKeys[key.Key]){
                        rst=false;
                        return;
                    };
                };
            });
            if(rst){
                KeyFunctions[KeyShortcuts[i][0]]();
                KeyShortcuts[i].__triggered__=true;
            };
        };
    };
});

$(document.body).keyup(function (evt) {
    for(let i=0;i<KeyShortcuts.length;i++){
        KeyShortcuts[i].forEach(key=>{
            if(key.Key){
                if(key.Key==evt.code){
                    KeyShortcuts[i].__triggered__=false;
                    return;
                };
            };
        });
    };
    pressedKeys[evt.code] = false;
});

document.getElementById('compile').addEventListener('click', ()=>{
    let ev1 = document.querySelectorAll('.line');
    let ev2 = document.querySelectorAll('.command');
    let ev3 = document.querySelectorAll('.values');
    let res = [];
    for(let i=0;i<ev1.length;i++){
        res[res.length]={
            line: ev1[i].textContent,
            command: ev2[i].value,
            values: ev3[i].value
        }
    };
    Compiler.Run(res);
});