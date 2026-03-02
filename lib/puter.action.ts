import puter from "@heyputer/puter.js";
import {getOrCreateHostingConfig, uploadImageToHosting} from "./puter.hosting";
import {isHostedUrl} from "./utils";

const PUTER_WORKER_URL = import.meta.env.VITE_PUTER_WORKER_URL;

export const getCurrentUser = async () => {
    try {
        const user = await puter.auth.getUser();
        return user ?? null;
    } catch (error) {
        console.error("Failed to get user:", error);
        return null;
    }
};


export const signIn = async () => {
    try {
        await puter.auth.signIn();
        const user = await puter.auth.getUser();
        return !!user;
    } catch (error) {
        console.error("Sign in failed:", error);
        return false;
    }
};


export const signOut = async () => {
    try {
        await puter.auth.signOut();
        return true;
    } catch (error) {
        console.error("Sign out failed:", error);
        return false;
    }
};

export const createProject = async ({ item, visibility = "private" }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
    if(!PUTER_WORKER_URL) {
        console.log('Missing VITE_PUTER_WORKER_URL; skip history fetch');
        return null;
    }

    const projectId = item.id;

    const hosting = await getOrCreateHostingConfig();

    const hostedSource = projectId ? await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: 'source' }) : null;

    const hostedRender = projectId && item.renderedImage ?
        await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: "rendered", }) : null;

    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage)
            ? item.sourceImage : "");

        if(!resolvedSource) {
            console.log('Failed to host source image. skipping save,')
            return null;
        }

    const resolvedRender = hostedRender?.url
        ? hostedRender?.url
        : item.renderedImage && isHostedUrl(item.renderedImage)
         ? item.renderedImage
            : undefined;
        
    const {
        sourcePath: sourcePath,
        renderedPath: renderedPath,
        publicPath: publicPath,
        ...rest
    } = item;
    
    const payload = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: resolvedRender,
    }
    
    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project: payload,
                visibility
            })
        });

        if(!response.ok) {
            console.error("Failed to save the project", await response.text());
            return null;
        }

        const data = (await response.json()) as { project?: DesignItem | null }
        return data?.project ?? null;
    } catch (e) {
        console.log('Failed to save project', e)
        return null;
    }

}


export const getProjects = async () => {

    if(!PUTER_WORKER_URL) {
        console.log('Missing VITE_PUTER_WORKER_URL; skip history fetch');
        return [];
    }

    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, { method: "GET" });

        if(!response.ok) {
            console.log("Failed to fetch history", await response.text());
            return [];
        }

        const data = (await response.json()) as { projects?: DesignItem[] | null };
        return Array.isArray(data?.projects) ? data?.projects : [];

    } catch (error) {
        console.error("Get projects error:", error);
        return [];
    }
};


export const getProjectById = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) {
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
        return null;
    }

    console.log("Fetching project with ID:", id);

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        console.log("Fetch project response:", response);

        if (!response.ok) {
            console.error("Failed to fetch project:", await response.text());
            return null;
        }

        const data = (await response.json()) as {
            project?: DesignItem | null;
        };

        console.log("Fetched project data:", data);

        return data?.project ?? null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
};


