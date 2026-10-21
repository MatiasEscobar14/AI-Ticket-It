export default class UsuarioController {
    constructor(UsuarioService) {
        this.UsuarioService = UsuarioService;
    }

    getAll = async (req, res, next) => {
        try {
            res.status(200).json(await this.UsuarioService.getAll());
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            res.status(201).json(await this.UsuarioService.create(req.body));
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            res.status(200).json(await this.UsuarioService.update(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    path = async (req, res, next) => {
        try {
            res.status(200).json(await this.UsuarioService.path(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            await this.UsuarioService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
