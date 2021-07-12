const db=require('mongoose'); //llama a mongoose

//definicion de funcion
//parametros
// var mongoconnect={
//     user:STRING,             //no codificado
//     pwd:STRING,              //no codificado
//     flaguseresadmin: INT,    //1 o 0
//
//     serverdb:STRING,
//     flagserverescluster:INT, //1 o 0
//
//     db:STRING,
// }
//sobre password codificado
//  https://stackoverflow.com/questions/6554039/how-do-i-url-encode-something-in-node-js  
//sobre el flag user es admin
//  https://mongoosejs.com/docs/connections.html
//  https://docs.mongodb.com/manual/reference/connection-string/#examples
//sobre el flag server es cluster
//  https://stackoverflow.com/questions/48917591/fail-to-connect-mongoose-to-atlas/48917626#48917626
//  en Atlas: MongoDB / Clusters: seleccionar cluster
//  + no es cluster:
//    boton connect / connect with the mongo shell
//    extraer nombre de servidor = serverdb
//    mongo "mongodb+srv://serverdb/db" --username USER
//  + es cluster
//    boton metrics
//    leer nombres de servidores Secundario-Primario-Secundario
//    servidor: db-shard-00-{00/01/02/}.ssenm.mongodb.net:puerto
async function connect(mongoconnect){
    console.log(mongoconnect);
    //user y pwd siempre se codifican
    mongoconnect.user=encodeURIComponent(mongoconnect.user);
    mongoconnect.pwd=encodeURIComponent(mongoconnect.pwd);
    //verifica si servidor es cluster y corrije prefijo
    var elprefijo="mongodb+srv"; //auxiliar de prefijo
    if( mongoconnect.flagserverescluster==1){elprefijo="mongodb";}
    //almacena localmente el serverdb
    var elserverdb=miconnect.serverdb; //auxiliar de servidor
        //elimina / al final de elserverdb
        if(elserverdb.slice(-1)=='/'){
        elserverdb=elserverdb.slice( 0,elserverdb.length-1  );
        }
    //construye opciones de conexion segun el prefijo
    var eldb=mongoconnect.db;//auxiliar de nombre de base de datos
    //opciones de conexion por defecto
    mongoconnect.options =
        {
            useNewUrlParser:true, //usa nuevo parser
            useUnifiedTopology: true, //es recomendable utilizar descubrimiento de servidores (nueva opcion)
        }
    //procesa prefijo
    if(elprefijo=="mongodb+srv"){
        //el servidor se especifica en opciones de url
        //no se debe adicionar / al final de elserverdb
        mongoconnect.options.dbName=mongoconnect.db; 
        eldb="";
        //verifica que solo exista 1 server
        //se intenta utilizar el primero
        var pos=elserverdb.indexOf(",");//posicion de separador de lista de servidores ,
        if(pos!=-1){
            //existe una lista de servidores, se utiliza el primero
            elserverdb=elserverdb.slice(0,pos);
            //verifica que no se utilicen puertos
            pos=elserverdb.indexOf(":"); //poisicion de inicio de puerto
            if(pos!=-1){
                //el servidor incluye puerto, se elimina
                elserverdb=elserverdb.slice(0,pos);
            }
        }
    }
    else{
        //el servidor se adiciona en url
        //adiciona / al final de elserverdb
        elserverdb = elserverdb + "/";
    }
    //construye opciones de url segun el flag
    mongoconnect.serverdboptions="?ssl=true&retryWrites=true&w=majority";
    //adiciona flag de admin a opciones de url
    if(mongoconnect.flaguseresadmin==1){
        mongoconnect.serverdboptions=mongoconnect.serverdboptions + "&authSource=admin";
    }
    
    //construye uri
    mongoconnect.url=elprefijo+"://"+mongoconnect.user+":"+mongoconnect.pwd
        +"@"+elserverdb+eldb+mongoconnect.serverdboptions;
    
    //depuracion
    console.log(mongoconnect.url);
    console.log(mongoconnect.options);

    //conecta a mongoose usando promesas
    await db.connect(mongoconnect.url,mongoconnect.options)
    .then(()=>{
        console.log('db conectada con exito');
    })
    .catch(error =>{
        console.log('Error de db:'+error);
    });
}



//conexion como servidor unico
var escluster=0;
var miserver="BASEDATOS.ssenm.mongodb.net/";
var miconnect={
    user:"USUARIO",       //no encriptado
    pwd:"PASSWORD",  //no encriptado
    flaguseresadmin:1,      //1 o 0
    serverdb:miserver,
    flagserverescluster:escluster,  //1 o 0
    db:"BASEDATOS",
}
connect(miconnect)


//conexion como cluster
var escluster=1;
var miserver="BASEDATOS-shard-00-01.ssenm.mongodb.net:PUERTO,BASEDATOS-shard-00-00.ssenm.mongodb.net:PUERTO,BASEDATOS-shard-00-02.ssenm.mongodb.net:PUERTO/";
var miconnect={
    user:"USUARIO",       //no encriptado
    pwd:"PASSWORD",  //no encriptado
    flaguseresadmin:1,      //1 o 0
    serverdb:miserver,
    flagserverescluster:escluster,  //1 o 0
    db:"BASEDATOS",
}
connect(miconnect)
