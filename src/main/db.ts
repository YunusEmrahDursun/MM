const sqlite3 = require('sqlite3').verbose();
class Database {

    query = async ( sql, args:any = [] ): Promise<any> => {
        const db = new sqlite3.Database('database.db');
        return new Promise((resolve, reject) => {
            console.log(sql)
            db.all(sql, args, (err, rows) => {
                if ( err )  {
                    var rejected={message:"Veri tabanı hatası!" };
                    console.log(err);
                    reject( rejected );
                }else{
                    resolve(rows);
                }
              
            });
          }).finally(() => {
            db.close();
          });
    }

    selectAll = async ({tableName,extra="",countRow=false}) => {
        if(extra==null){
            extra="";
        }
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        var query=`SELECT ${ countRow ? "SQL_CALC_FOUND_ROWS" : "" } * FROM ${tableName} WHERE 1=1 ${extra};${ countRow ? "SELECT FOUND_ROWS() AS max;" : "" }`;
        return this.query(query);
    }
    selectQuery = async ({where={},tableName,mode="AND",extra="",countRow=false}) => {
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        if(Object.keys(where).length==0){
            throw "sorgualanieksik";
        }
        var query="";
        query=selectQueryConverter(tableName,where,mode,extra,countRow);
        if(query==""){
            throw "sorgubulunamadi";
        }
        return this.query(query,Object.keys(where).map(y=> where[y]));
    }
    selectOneQuery = async ({where={},tableName,mode ="AND",extra="",countRow=false}) => {
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        if(Object.keys(where).length==0){
            throw "sorgualanieksik";
        }
        var query="";
        query=selectQueryConverter(tableName,where,mode,extra,countRow);
        if(query==""){
            throw "sorgubulunamadi";
        }
        const rows = await this.query(query,Object.keys(where).map(y=> where[y]));

        return rows[0];
         
    }
    getById = async ({id,tableName})=>{
        let where={ [tableName.split("_")[0]+"_id"] :id};
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        if(!id){
            throw "idbulunamadi";
        }
        var query=selectQueryConverter(tableName,where,"AND","",false);
        if(query==""){
            throw "sorgubulunamadi";
        }
        var result=await this.query(query,Object.keys(where).map(y=> where[y]));
        if(Array.isArray(result) && result.length){
            return result[0];
        }
        return null;
    }
    selectLike = async ({tableName,where={},mode ="AND",extra="",countRow=false}) => {
        //var a=await new db().selectWithColumn(["id","a"],"test");
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        
        var query="";
        query=selectLikeConverter(tableName,where,mode,extra,countRow);
        if(query==""){
            throw "sorgubulunamadi";
        }
        return this.query(query,Object.keys(where).map(y=> "%"+where[y]+"%"));
    }
    selectLikeWithColumn = async ({colNameS=[],tableName,where={},mode ="AND",extra,extraData}) => {
        //var a=await new db().selectWithColumn(["id","a"],"test");
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        if(colNameS.length==0){
            throw "kolonisimlerieksik";
        }
        var query="";
        query=selectLikeWithColumnConverter(tableName,colNameS,where,mode,extra);
        if(query==""){
            throw "sorgubulunamadi";
        }
        return this.query(query,Object.keys(where).map(y=> "%"+where[y]+"%").concat(extraData));
    }
    selectWithColumn = async ({colNameS=[],tableName,where={},mode ="AND"}) => {
        //var a=await db.selectWithColumn(["id","a"],"test");
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        if(colNameS.length==0){
            throw "kolonisimlerieksik";
        }
        var query="";
        query=selectWithColumnConverter(tableName,colNameS,where,mode);
        if(query==""){
            throw "sorgubulunamadi";
        }
        return this.query(query,Object.keys(where).map(y=> where[y]));
    }
    insert = async ({data={},tableName}) => {
        //await new db().insert({ a:"azxzcxzxczsol",b:"1231"},"test")
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        if(Object.keys(data).length==0){
            throw "veribulunamadi";
        }
        else if(typeof(data)=="object"){
            const db = new sqlite3.Database('database.db');
            return new Promise((resolve,rejected)=>{
                const insert = db.prepare(insertConverter(tableName,data));
                insert.run(Object.values(data), function(err) {
                    if (err) {
                      return  rejected(err.message);
                    }
                    resolve(this.lastID);
                });
                insert.finalize();
    
            }).finally(() => {
                db.close();
            });
            
            
        }
        else{
            throw "veritipihatali";
        }
       
    }
    remove = async ({where={},tableName,mode ="AND"}) => {
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        if( Object.keys(where).length==0){
            throw "sorgualanieksik";
        }
        var query="";
        query=removeConverter(tableName,where,mode);
        if(query==""){
            throw "sorgubulunamadi";
        }
        return this.query(query,Object.keys(where).map(y=> where[y]));
    }
    update = async ({data={},where={},tableName,mode ="AND"}) => {
        //var a=await new db().update({a:"a",b:"b"},{b:"b"},"test");
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        if(Object.keys(where).length==0){
            throw "sorgualanieksik";
        }
        if(Object.keys(data).length==0){
            throw "veribulunamadi";
        }
        var query="";
        query=updateConverter(tableName,data,where,mode);
        if(query==""){
            throw "sorgubulunamadi";
        }
        var arr1=Object.keys(data).map(y=> data[y])
        var arr2=Object.keys(where).map(y=> where[y])
        var concat= arr1.concat(arr2);
        return this.query(query,Object.keys(concat).map(y=> concat[y]));
    }
    selectIn = async ([colName,data=[],tableName,not=false,extra="",countRow=false]) => {
        //data [1,2,3,4] şeklinde olmalı
        //var a=await new db().selectIn("id",[1,2],"sayfalar");
        if(!tableName || tableName==""){
            throw "tabloismibulunamadi";
        }
        if(data.length==0){
            throw "veribulunamadi";
        }
        if(!colName){
            throw "kolonadibulanamadi";
        }
        let _not:"NOT"| "" =""
        if(not){
            _not="NOT"
        }
        var query="";
        query=selectInConverter(tableName,colName,extra,countRow,_not);
        if(query==""){
            throw "sorgubulunamadi";
        }
        return this.query(query,[data]);
    
    }
}


//Converters
const insertConverter = (_tableName:string,_object:object) => {
    return `INSERT INTO ${_tableName} (${Object.keys(_object).toString()}) VALUES  (${Object.keys(_object).map(_=> '?').toString()})`; 
}
const removeConverter = (_tableName:string,_where:object,_mode ) => {
    return `DELETE FROM ${_tableName} WHERE ${Object.keys(_where).map(x=> x+"= ? ").join(_mode+" ")}`; 
}
const selectQueryConverter = (_tableName:string,_where:object,_mode,_extra:string,_countRow:boolean) => {
    return `SELECT ${ _countRow ? "SQL_CALC_FOUND_ROWS" : "" } * FROM ${_tableName} as g WHERE ( ${Object.keys(_where).map(x=> "g."+x+"= ? ").join(_mode+" ")} ) AND 1=1 ${_extra} ; ${ _countRow ? "SELECT FOUND_ROWS() AS max;" : "" }`;
}
const selectLikeConverter = (_tableName:string,_where:object,_mode,_extra:string,_countRow:boolean) => {
    return `SELECT ${ _countRow ? "SQL_CALC_FOUND_ROWS" : "" } * FROM ${_tableName} WHERE ( ${ _where && Object.keys(_where).length != 0 ? Object.keys(_where).map(x=> x+" LIKE ? ").join(_mode+" "):"1=1" } ) AND 1=1 ${_extra} ; ${ _countRow ? "SELECT FOUND_ROWS() AS max;" : "" }`;
}
const selectLikeWithColumnConverter = (_tableName:string,_colNameS:string[],_where:object,_mode,_extra:string) => {
    return `SELECT ${_colNameS} FROM ${_tableName} WHERE ( ${ _where && Object.keys(_where).length != 0 ? Object.keys(_where).map(x=> x+" LIKE ? ").join(_mode+" "):"1=1" } ) AND 1=1 ${_extra}`;
}
const selectWithColumnConverter = (_tableName:string,_colNameS:string[],_where:object,_mode) => {
    return `SELECT ${_colNameS} FROM ${_tableName} WHERE ( ${ _where && Object.keys(_where).length != 0 ? Object.keys(_where).map(x=> x+"= ? ").join(_mode+" "):"1=1" } ) AND 1=1`;
}
const updateConverter = (_tableName:string,_object:object,_where:object,_mode) => {
    return `UPDATE ${_tableName} SET ${Object.keys(_object).map(x=> x+"= ? ").toString()} WHERE ${Object.keys(_where).map(x=> x+"= ? ").join(_mode+" ")}`;
}
const selectInConverter = (_tableName:string,_colName:string,_extra:string,_countRow :boolean,_not:"NOT"| "" ) => {
    return `SELECT ${ _countRow ? "SQL_CALC_FOUND_ROWS" : "" } * FROM ${_tableName} WHERE ${_colName} ${_not} IN (?) AND 1=1 ${_extra} ; ${ _countRow ? "SELECT FOUND_ROWS() AS max;" : "" }`;
}


export default new Database();