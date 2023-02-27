import { Router } from "express";
import { methods as salasController } from "./../controllers/salas.controller";

const router = Router();
//Definimos las rutas de acceso para cada metodo
router.get("/", salasController.getSala);
router.get("/:id", salasController.getSalas);
router.post("/", salasController.addSala);
router.delete("/:id", salasController.deleteSala);
router.put("/:id", salasController.updateSala);
router.post("/reserva",salasController.addReserva);
router.get("/oc/up", salasController.getNocurriendo);
router.get("/oc/op", salasController.getOcurriendo);
router.put("/bloquea/:idReserva",salasController.updateBloquea);
router.put("/desbloquea/:idReserva",salasController.updateDesloquea);
router.get("/oc/res/:id", salasController.getNocurriendoReserva);
router.get("/ob/res/ervas/:id",salasController.getReserva);
router.post("/va/li/da",salasController.valida);

export default router; 