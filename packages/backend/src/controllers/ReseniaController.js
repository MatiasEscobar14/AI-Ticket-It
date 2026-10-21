export default class ReseniaController {
    constructor(ReseniaService) {
        this.ReseniaService = ReseniaService;
    }

    getAll = async (req, res, next) => {
        try {
            res.status(200).json(await this.ReseniaService.getAll());
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            res.status(201).json(await this.ReseniaService.create(req.body));
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            res.status(200).json(await this.ReseniaService.update(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    path = async (req, res, next) => {
        try {
            res.status(200).json(await this.ReseniaService.path(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            await this.ReseniaService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
