export default class EventoController {
    constructor(EventoService) {
        this.EventoService = EventoService;
    }

    getAll = async (req, res, next) => {
        try {
            res.status(200).json(await this.EventoService.getAll());
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            res.status(201).json(await this.EventoService.create(req.body));
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            res.status(200).json(await this.EventoService.update(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    path = async (req, res, next) => {
        try {
            res.status(200).json(await this.EventoService.path(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            await this.EventoService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
