String.prototype.contains = function(toCheck) {
    return this.indexOf(toCheck) >= 0;
}

var LastSpace = 10000;
var LinesCount = {};
var FocusedOn = [];

var KeyFunctions = {
    update: (cls) => {
        let rst = document.querySelectorAll('.'+cls);
        let found = -1;
        for(let i=0;i<rst.length;i++) {
            if(rst[i].textContent.match('Remove')){
                if(rst[i+1]){
                    found=i+1;
                };
                break;
            };
        };
        if(found==-1)return;
        for(let i=found;i<rst.length;i++) {
            rst[i].textContent=String(Number("1"+rst[i].textContent)-10).substring(1,5);
        };
    },
    AddNewSpace: () => {
        if(LastSpace>=19990)return;
        LastSpace+=10;
        let id = "lin"+Math.random();
        $("#line").append(`<div id="${id}" class="line">${String(LastSpace).substring(1,5)}</div>`);
        let line = document.getElementById(id);
        line.addEventListener('click', ()=>{
            if(line.textContent=='0010'&&document.querySelectorAll('.line').length==1)return;
            if(LinesCount.id!=id){
                LinesCount.id=LinesCount.id||id;
                LinesCount.text=LinesCount.text||line.textContent;
                document.getElementById(LinesCount.id).textContent=LinesCount.text;
                LinesCount.id=id;
                LinesCount.text=line.textContent;
                line.textContent="Remove?"
            } else {
                KeyFunctions.update("line");
                LastSpace-=10;
                LinesCount.id=undefined;
                let pos = (Number("1"+LinesCount.text)%10000)/10-1;
                document.querySelectorAll('.command')[pos].remove();
                document.querySelectorAll('.values')[pos].remove();
                LinesCount.text=undefined;
                line.remove();
            };
        });
        let id2 = "cmd"+Math.random();
        $("#command").append(`<input id="${id2}" class="command" type="text" placeholder="save">`);
        let cmd = document.getElementById(id2);
        cmd.onkeydown = () => {
            setTimeout(() => {
                if(!cmd.value){
                    KeyFunctions.UpdatePropositions([]);
                    return;
                };
                let propositions = [];
                for(let i=0;i<Commands.length;i++) {
                    if(Commands[i].name.contains(cmd.value)){
                        propositions[propositions.length]=Commands[i].name;
                    };
                };
                KeyFunctions.UpdatePropositions(propositions, cmd);
            },0);
        };
        cmd.addEventListener('focus', ()=>{
            if(LinesCount.id){
                document.getElementById(LinesCount.id).textContent=LinesCount.text;
                LinesCount.id=undefined;
                LinesCount.text=undefined;
            };
            FocusedOn[0]=cmd;
            cmd.onkeydown();
        });
        cmd.addEventListener('blur', ()=>{
            if(LinesCount.id){
                document.getElementById(LinesCount.id).textContent=LinesCount.text;
                LinesCount.id=undefined;
                LinesCount.text=undefined;
            };
            FocusedOn[0]=undefined;
            setTimeout(()=>{
                KeyFunctions.UpdatePropositions([]);
            },150);        
        });
        cmd.focus();
        let id3 = "val"+Math.random();
        $("#values").append(`<input id="${id3}" class="values" type="text" placeholder="<var> <param>">`);
        let val = document.getElementById(id3);
        val.addEventListener('focus', ()=>{
            if(LinesCount.id){
                document.getElementById(LinesCount.id).textContent=LinesCount.text;
                LinesCount.id=undefined;
                LinesCount.text=undefined;
            };
            FocusedOn[0]=val;
        });
        val.addEventListener('blur', ()=>{
            if(LinesCount.id){
                document.getElementById(LinesCount.id).textContent=LinesCount.text;
                LinesCount.id=undefined;
                LinesCount.text=undefined;
            };
            FocusedOn[0]=undefined;
        });
    },
    UpdatePropositions: (props,foc) => {
        let lpr = document.getElementById('propositions');
        lpr.innerHTML=""
        if(props.length==0){
            lpr.style.display='none';
            return;
        };
        lpr.style.left="20vw";
        lpr.style.top=foc.getBoundingClientRect().top+'px';
        lpr.style.display='block';
        let pr = $("#propositions");
        for(let i=0;i<props.length;i++){
            let id="prp"+Math.random();
            pr.append(`<button type="button" id="${id}" class="proposition">${props[i]}</button>`);
            let prop = document.getElementById(id);
            prop.addEventListener("click", ()=>{
                foc.value=props[i];
            });
        };
    },
    MoveNext: () => {
        if(!FocusedOn[0])return;
        if(FocusedOn[0].className.match('command')){
            let cmds = document.querySelectorAll('.command');
            for(let i=0; i<cmds.length; i++){
                if(cmds[i].id==FocusedOn[0].id){
                    document.querySelectorAll('.values')[i].focus();
                    break;
                };
            };
        } else {
            let cmds = document.querySelectorAll('.values');
            for(let i=0; i<cmds.length; i++){
                if(cmds[i].id==FocusedOn[0].id){
                    document.querySelectorAll('.command')[i].focus();
                    break;
                };
            };
        };
    },
    RemoveLastSpace: () => {
        if(LastSpace<=10010)return;
        LastSpace-=10;
        let ls1 = document.querySelectorAll('.line');
        let ls2 = document.querySelectorAll('.command');
        let ls3 = document.querySelectorAll('.values');
        ls1[ls1.length-1].remove();
        ls2[ls2.length-1].remove();
        ls3[ls3.length-1].remove();
    }
};

var KeyShortcuts = [
    [
        'AddNewSpace',
        {
            Key: 'ShiftLeft'
        },
        {
            Key: 'Enter'
        }
    ],
    [
        'RemoveLastSpace',
        {
            Key: 'ShiftLeft'
        },
        {
            Key: 'Delete'
        }
    ],
    [
        'MoveNext',
        {
            Key: 'ShiftLeft'
        },
        {
            Key: 'ArrowRight'
        }
    ],
    [
        'MoveNext',
        {
            Key: 'ShiftLeft'
        },
        {
            Key: 'ArrowLeft'
        }
    ],
    [
        'MovePropRight',
        {
            Key: 'ArrowRight',
        },
    ],
    [
        'MovePropLeft',
        {
            Key: 'ArrowLeft',
        },
    ]
];

var Commands = [
    {
        name: 'loadi',
        description: 'Load Immediate, access with single $ sign'
    },
    {
        name: 'load0',
        description: 'Load Value to position 0'
    },
    {
        name: 'load1',
        description: 'Load Value to position 1'
    },
    {
        name: 'load2',
        description: 'Load Value to position 2'
    },
    {
        name: 'load3',
        description: 'Load Value to position 3'
    },
]