# mongo-mongoose-nodejs
Conexion a MongoDB Atlas desde NodeJS usando mongoose (mongodb o mongodb+srv)

En 2018 MongoDB ha adquirido a MLab por lo que las cadenas de conexion usualmente utilizadas han cambiado (https://www.silicon.es/mongodb-comprara-mlab-y-su-servicio-de-base-de-datos-en-la-nube-2383965)

Utilizando la información de Platzi (https://platzi.com/clases/backend-js/) y Udemy(https://www.udemy.com/course/serverless-restful-api-con-nodejs-guia-facil-y-definitiva/) e información disponible en Internet, he consolidado las tres decisiones importantes que definen la cadena de conexion y las opciones para Mongoose
Se define la funcion "connect" que acepta un unico parametro cuya especificacion es la siguiente
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

1) el password debe codificarse (encodeURIComponent) si utiliza caracteres especiales (he incluido tambien el usuario)
//  https://stackoverflow.com/questions/6554039/how-do-i-url-encode-something-in-node-js  

2) se debe especificar si el usuario es administrador o un usuario de la base de datos (flag user es admin)
//  https://mongoosejs.com/docs/connections.html
//  https://docs.mongodb.com/manual/reference/connection-string/#examples

3) se debe especificar si el servidor es unico o un cluster (normalmente tres) (flag server es cluster)
//  https://stackoverflow.com/questions/48917591/fail-to-connect-mongoose-to-atlas/48917626#48917626
Por defecto se suele emplear el servidor unico.
En Atlas: MongoDB / Clusters: seleccionar cluster
Si deseas conectarte como servidor unico (no es cluster):
    boton connect / connect with the mongo shell
    extraer nombre de servidor = serverdb
    mongo "mongodb+srv://serverdb/db" --username USER
Si deseas conectarte como cluster (es cluster)
    boton metrics
    leer nombres de servidores Secundario-Primario-Secundario
    servidor: db-shard-00-{00/01/02/}.ssenm.mongodb.net:puerto
