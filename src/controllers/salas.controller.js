import {getConnection} from "./../database/database";

//Retorna la información de las salas que tenemos en la base de datos.
const getSala = async(req,res)=>{
    try{
    const connection= await getConnection();
    const result = await connection.query("SELECT * from salas");
    res.json(result);
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};
//Verifica devuelve toda la información de la reserva que esta siendo ejecutada en este momento.
const getReserva = async(req,res)=>{
    try{
        const {id}=req.params
    const connection= await getConnection();
    const result = await connection.query("SELECT * from reserva WHERE idSala=? and fechaInicio<=now() and fechaSalida>=now()",id);
    res.json(result);
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};

//Devuelve la informacion de una sala buscandola por su id
const getSalas = async(req,res)=>{
    try{
        console.log(req.params);
        const {id}=req.params
    const connection= await getConnection();
    const result = await connection.query("SELECT * from salas WHERE idSala=?",id);
    res.json(result);
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};
//Devuelve la informacion de las salas que no están siendo usadas.
const getNocurriendo = async(req,res)=>{
    try{
    const connection= await getConnection();
    const result = await connection.query("SELECT * from reserva where ocurriendo=0 order by fechaInicio asc");
    res.json(result);
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};
//Valida si la sala esta reservada en determinado rango de tiempo
const valida = async(req,res)=>{
    try{
        const {fechaInicio,fechaSalida,idSala}=req.body;
    const connection= await getConnection();
    const result = await connection.query("select * from reserva where idSala=? and (fechaInicio<=? and fechaSalida>=? OR fechaInicio<=? and fechaSalida>=?)",[idSala,fechaInicio,fechaInicio,fechaSalida,fechaSalida]);
    res.json(result);
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};
//Devuelve informacion de cierta reserva con determinado id y que no este siendo ocupada
const getNocurriendoReserva = async(req,res)=>{
    try{
    const {id}=req.params
    const connection= await getConnection();
    const result = await connection.query("SELECT * from reserva where ocurriendo=0 and idSala=?",id);
    res.json(result);
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};
//Selecciona las informacion de las salas que estan siendo ocupadas.
const getOcurriendo = async(req,res)=>{
    try{
    const connection= await getConnection();
    const result = await connection.query("SELECT * from reserva where ocurriendo=1 order by fechaSalida asc");
    res.json(result);
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};


//Agrega una sala
const addSala = async(req,res)=>{
    try{
        
        const {nombre,capacidad,status}=req.body;
        if(nombre==undefined || capacidad == undefined || status== undefined){
            res.status(400).json({message:"Bad Request. Please fill all fields"});
        }
        const info={
            nombre,capacidad,status
        };

        const connection= await getConnection();
       
       const result = await connection.query("INSERT INTO salas SET ?",info);
        res.json({message:"Sala added"});
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};
//Agrega una reserva
const addReserva = async(req,res)=>{
    try{
        
        const {idSala,nombreUsuario,fechaInicio,fechaSalida,ocurriendo}=req.body;
        if(idSala==undefined || nombreUsuario == undefined || fechaInicio== undefined || fechaSalida==undefined || ocurriendo==undefined){
            res.status(400).json({message:"Bad Request. Please fill all fields"});
        }
        const info={
            idSala,nombreUsuario,fechaInicio,fechaSalida,ocurriendo
        };

        const connection= await getConnection();
       
       const result = await connection.query("INSERT INTO reserva SET ?",info);
        res.json({message:"Reserva added"});
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};
//Elimina una sala
const deleteSala = async(req,res)=>{
    try{
        console.log(req.params);
        const {id}=req.params
    const connection= await getConnection();
    const result = await connection.query("DELETE FROM salas WHERE idSala=?",id);
    res.json(result);
    
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};
//Actualiza una sala
const updateSala = async(req,res)=>{
    try{
        const {id}=req.params;
        const {nombre,capacidad,status}=req.body;
        if(id==undefined || nombre==undefined || capacidad == undefined || status== undefined){
            res.status(400).json({message:"Bad Request."});
        }
        const info={
            nombre,capacidad,status
        };
    const connection= await getConnection();
    const result = await connection.query("UPDATE salas SET ? WHERE idSala=?",[info,id]);
    res.json(result);
    return result;
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};
//Actualiza para bloquear una sala, mostrando que esta ocupado y cambiando la bandera en la base de datos.
const updateBloquea=async(req,res)=>{
    try{
        const {idReserva}=req.params;
        const {idSala}=req.body;
        if(idReserva==undefined||idSala==undefined){
            res.status(400).json({message:"Bad Request"});
        }const info={idSala};
        const connection=await getConnection();
        const result=await connection.query("UPDATE salas SET status='Ocupado' where idSala=?",idSala);
        result=await connection.query("UPDATE reserva SET ocurriendo=1 where idReserva=?",idReserva);
        res.json(result);
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
}
//Desbloquea una sala, cambiando el status a disponible y eliminando el registro de la tabla reservas.
const updateDesloquea=async(req,res)=>{
    try{
        const {idReserva}=req.params;
        const {idSala}=req.body;
        if(idReserva==undefined||idSala==undefined){
            res.status(400).json({message:"Bad Request"});
        }const info={idSala};
        const connection=await getConnection();
        const result=await connection.query("UPDATE salas SET status='Disponible' where idSala=?",idSala);
        result=await connection.query("DELETE from reserva where idReserva=?",idReserva);
        res.json(result);
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
}


//Exportamos todos los metodos.
export const methods = {
    getSala,
    getSalas,
    addSala,
    deleteSala,
    updateSala,
    addReserva,
    getNocurriendo,
    updateBloquea,
    updateDesloquea,
    getOcurriendo,
    getNocurriendoReserva,
    getReserva,
    valida

};
