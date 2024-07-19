const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/home/ayush/.docker/desktop/docker.sock' });


async function checkNetwork(networkName: string): Promise<boolean> {
    const networks = await docker.listNetworks();
    const networkNames = networks.map((network: any) => ({
        id: network.Id,
        name: network.Name,
    }));
    console.log('Networks:', networkNames);

    return networkNames.some((network: any) => network.name === networkName);
}


async function checkContainer(containerName: string) {
    const containers = await docker.listContainers({all: true})
    const containerNames = containers.map((container: any) => ({
        id: container.Id,
        name: container.Names[0],
        state: container.State
    }));
    console.log('Containers:', containerNames);

    const result= containerNames.some((container: any) => container.name === containerName);
    if (result === true) {
        const container= containerNames.find((container: any) => container.name === containerName);
        if (container.state === 'running') {
            return true
        }
        else {
            const minioContainer= docker.getContainer(container.id);
            await minioContainer.start();
            return true
        }
    }
    else {
        return false
    }
}


async function createNetwork() {
    return docker.createNetwork({ 
        Name: 'my-network',
        Driver: 'bridge'
    });
}


async function runMinioContainer() {
    return docker.createContainer({
        Image: 'quay.io/minio/minio',
        Cmd: ['server', '/data', '--console-address', ':9001'],
        name: 'minio2',
        Env: [
            'MINIO_ROOT_USER=user',
            'MINIO_ROOT_PASSWORD=password'
        ],
        ExposedPorts: {
            '9000/tcp': {},
            '9001/tcp': {}
        },
        HostConfig: {
            PortBindings: {
                '9000/tcp': [{ HostPort: '9000' }],
                '9001/tcp': [{ HostPort: '9001' }]
            }
        },
        NetworkingConfig: {
            EndpointsConfig: {
                'my-network': {}
            }
        },
        Volumes: {
            '/data': {
                bind: '~/minio/data'
            }
        }
        // @ts-ignore
    }).then(container => container.start());
}


async function main() {
    try {
        // const network = await createNetwork();
        // console.log(`Network ${network.id} created`);
        // console.log('Network details:', network);

        // await runMinioContainer();
        // console.log('MinIO container started');

        const isNetworkPresent= await checkNetwork('my-network');

        if (isNetworkPresent === true) {
            console.log('Network my-network is present');
        } 
        else {
            const network = await createNetwork();
            console.log(`Network created with ID: ${network.id}`);
        }

        
        const isContainerPresent= await checkContainer('/minio2')

        if (isContainerPresent === true) {
            console.log('Container minio2 is present');
        } 
        else {
            await runMinioContainer();
            console.log('MinIO container started');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

main();
