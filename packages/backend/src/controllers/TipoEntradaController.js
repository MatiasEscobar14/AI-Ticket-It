export default class TipoEntradaController {
    constructor(TipoEntradaService) {
        this.TipoEntradaService = TipoEntradaService;
    }

    getAll = async (req, res, next) => {
        try {
            res.status(200).json(await this.TipoEntradaService.getAll());
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            res.status(201).json(await this.TipoEntradaService.create(req.body));
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            res.status(200).json(await this.TipoEntradaService.update(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    path = async (req, res, next) => {
        try {
            res.status(200).json(await this.TipoEntradaService.path(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            await this.TipoEntradaService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
