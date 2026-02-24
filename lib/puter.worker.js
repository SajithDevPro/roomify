const PROJECT_PREFIX = 'roomify_project:';

const jsonError = (status, message, extra = {}) => {
    return new Response(
        JSON.stringify({ error: message, ...extra }),
        {
            status,
            headers: {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
    );
};

const getUserId = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser();
        return user?.uuid || null;
    } catch {
        return null;
    }
};

router.post('/api/projects/save', async ({ request, user }) => {
    try {
        const userPuter = user?.puter;

        if (!userPuter) {
            return jsonError(401, 'Authentication failed');
        }

        const body = await request.json();
        const project = body?.project;

        if (!project?.id || !project?.sourceImage) {
            return jsonError(400, 'Project not found');
        }

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        };

        const userId = await getUserId(userPuter);

        if (!userId) {
            return jsonError(401, 'Authentication failed');
        }

        const key = `${PROJECT_PREFIX}${project.id}`;

        await userPuter.kv.set(key, payload);

        return new Response(
            JSON.stringify({
                saved: true,
                id: project.id,
                project: payload
            }),
            {
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );

    } catch (e) {
        const error = e instanceof Error ? e.message : 'Unknown error';

        return jsonError(500, 'Failed to save project', {
            message: error
        });
    }
});


router.get('/api/projects/list', async ({ user }) => {
    try {
        const userPuter = user?.puter;

        if (!userPuter) {
            return jsonError(401, 'Authentication failed');
        }

        const keys = await userPuter.kv.list();

        const projectKeys = keys.filter(key =>
            key.startsWith(PROJECT_PREFIX)
        );

        const projects = await Promise.all(
            projectKeys.map(key => userPuter.kv.get(key))
        );

        return new Response(
            JSON.stringify({ projects }),
            {
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );

    } catch (e) {
        return jsonError(500, 'Failed to list projects', {
            message: e?.message || 'Unknown error'
        });
    }
});


router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const userPuter = user?.puter;

        if (!userPuter) {
            return jsonError(401, 'Authentication failed');
        }

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return jsonError(400, 'Project id is required');
        }

        const key = `${PROJECT_PREFIX}${id}`;

        const project = await userPuter.kv.get(key);

        if (!project) {
            return jsonError(404, 'Project not found');
        }

        return new Response(
            JSON.stringify({ project }),
            {
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );

    } catch (e) {
        return jsonError(500, 'Failed to fetch project', {
            message: e?.message || 'Unknown error'
        });
    }
});
