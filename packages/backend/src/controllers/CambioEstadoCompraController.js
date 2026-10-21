
export default class CambioEstadoCompraController {
    constructor(CambioEstadoCompraService) {
        this.CambioEstadoCompraService = CambioEstadoCompraService;
    }

    getAll = async (req, res,next) => { 
        try {
            res.status(200).json(await this.CambioEstadoCompraService.getAll());
        } catch (error) {
            next(error);
        }
    }

    create = async (req, res,next) => {
        try {
            const creado = await this.CambioEstadoCompraService.create(req.body);
            res.status(201).json(creado);
        } catch (error) {
            next(error);
        }   
    }
    update = async (req, res,next) => { 
        try {
            const id = req.params.id;
            const actualizado = await this.CambioEstadoCompraService.update(id, req.body);
            res.status(200).json(actualizado);
        } catch (error) {
            next(error);
        }
    }
    path = async (req, res,next) => {
        try {
            const {id} = req.params;
            const EstadoActualizado = await this.CambioEstadoCompraService.path(id, req.body);
            res.status(200).json(EstadoActualizado);
        } catch (error) {
            next(error);
        }
    }
    delete = async (req, res,next) => { 
        try {
            const id = req.params.id;
            await this.CambioEstadoCompraService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }   
    }   
        
}    