export default class CompraController {
    constructor(CompraService) {
        this.CompraService = CompraService;
    }

    getAll = async (req, res, next) => {
        try {
            res.status(200).json(await this.CompraService.getAll());
        } catch (error) {
            next(error);
        }
    };

    getByComprador = async (req, res, next) => {
        try {
            res.status(200).json(await this.CompraService.getByComprador(req.params.id));
        } catch (error) {
            next(error);
        }
    };
    getByEvento = async (req, res, next) => {
        try {
            res.status(200).json(await this.CompraService.getByEvento(req.params.id));
        } catch (error) {
            next(error);
        }
    }

    create = async (req, res, next) => {
        try {
            res.status(201).json(await this.CompraService.create(req.body));
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            res.status(200).json(await this.CompraService.update(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    path = async (req, res, next) => {
        try {
            res.status(200).json(await this.CompraService.path(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    cancelar = async (req, res, next) => {
        try {
            res.status(200).json(await this.CompraService.cancelar(req.params.id));
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            await this.CompraService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
