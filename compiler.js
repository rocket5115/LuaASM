let __Compile__ = `
    local __compiler_reserved__ = nil
    local __compiler_reserved__0 = nil
    local __compiler_reserved__1 = nil
    local __compiler_reserved__2 = nil
    local __compiler_reserved__3 = nil
`

const Compiler = {};
Compiler.Commands = {
    loadi: `__compiler_reserved__=$CMP$`,
    save: `$CMP$=__compiler_reserved__`,
    print: `print($CMP$)`
};
const TranslateValues = (val,str) => {
    val.replace(' ','');
    if(val.contains('$')){
        if(val=='$'){
            return '__compiler_reserved__';
        }else{
            let ret = val.replace('$[').replace(']');
            if(Number(ret)){
                return '__compiler_reserved__'+ret;
            }else{
                return ret.replace('$','');
            }
        }
    } else {
        if(!Number(val)&&str){
            return '"'+val+'"';
        }else{
            return val;
        };
    };
};
Compiler.Run = (program) => {
    for(let i=0;i<program.length;i++){
        let prm = Compiler.Commands[program[i].command].replace('$CMP$',TranslateValues(program[i].values,program[i].command=='save'?false:true));
        __Compile__+="\n    "+prm
    };
    console.log(__Compile__)
};