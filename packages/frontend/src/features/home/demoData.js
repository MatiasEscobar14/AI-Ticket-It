import { api } from '../../services/api';
import { eventos as mockEvents } from '../../mockdata/Eventos';

const organizerIdentity = { nombre: 'Matias Escobar', apellido: 'Demo' };

let demoDataPromise;

async function initializeDemoData() {
    let [users, categories, events] = await Promise.all([
        api.getUsers(),
        api.getCategories(),
        api.getEvents(),
    ]);

    let organizer = users.find(
        (user) => user.nombre === organizerIdentity.nombre && user.apellido === organizerIdentity.apellido
    );
    if (!organizer) {
        organizer = await api.createUser({ ...organizerIdentity, favoritos: [] });
        users = [...users, organizer];
    }

    if (events.length === 0) {
        const categoryByName = new Map(categories.map((category) => [category.nombre, category]));

        for (const mockEvent of mockEvents) {
            const categoryName = mockEvent.categoria.nombre;
            let category = categoryByName.get(categoryName);
            if (!category) {
                category = await api.createCategory({
                    nombre: categoryName,
                    descripcion: mockEvent.categoria.descripcion || `Eventos de ${categoryName}.`,
                });
                categoryByName.set(categoryName, category);
                categories = [...categories, category];
            }

            await api.createEvent({
                nombre: mockEvent.nombre,
                descripcion: mockEvent.descripcion,
                categoria: category.id,
                fecha: mockEvent.fecha,
                multimedia: mockEvent.multimedia,
                organizador: organizer.id,
                tiposEntrada: mockEvent.tiposEntrada,
            });
        }
        events = await api.getEvents();
    }

    return {
        users,
        categories,
        events,
        organizer,
    };
}

export function prepareDemoData() {
    if (!demoDataPromise) {
        demoDataPromise = initializeDemoData().catch((error) => {
            demoDataPromise = undefined;
            throw error;
        });
    }
    return demoDataPromise;
}
